# AIL: Agentic Intermediate Language

> People review the spec. Agents compile it. Machines check that the two agree.

## 1. The problem

When agents write most of the code, reviewing the code stops being the best
use of a reviewer's time. What a reviewer needs to see is **why** something
exists, **what** it does and **how** the important decisions were made. All
of that should be precise enough that any model, at any temperature and from
any vendor, produces software that behaves the same.

Models are not deterministic, and no prompt will make them so. AIL's answer:

1. **Leave the model nothing important to decide.** Every degree of freedom is
   fixed by the spec (including its `target` conventions and design tokens), or
   it is explicitly listed as `free`.
2. **Never trust, always verify.** Generated code is accepted only if it passes
   every check the spec implies. The IL is the oracle; the model is a search
   procedure.
3. **Find ambiguity before users do.** Sample the compiler several times,
   across vendors. If the samples disagree, the spec has a hole, and the report
   says where.
4. **Never compile the same thing twice.** Content hashes plus a lock file mean
   that an unchanged node keeps its verified code, so it can't drift.

## 2. The node

Everything is one recursive shape, from the product down to a button:

```ail
node Name : kind   level: product|experience|system|specialist   @tags
  why       rationale, traced to an ancestor with  <- Ancestor
  what      observable contract: claims, scenarios, examples, probes
  how       decide … because … rejected … because …
  look      visual expression in catalog tokens and components
  copy      every user-visible string, verbatim
  binds     props, state, events: how a view connects to logic
  free      [ the only things the compiler may choose ]
  uses      dependencies (only their `what` is visible)
  children  refinement (the review tree)
  verify    properties needing a derived check
```

The sections, the contents of `what` and the notation for types, signatures
and values are defined in [language.md](language.md). The notation belongs to
no programming language: the target is named once, and every compiler
translates the spec into that target's conventions.

Two graphs live in one file:

- **children** form the *review tree*. A parent's claims are refined by its
  descendants (`refined-by:`). You read top-down and stop where the detail
  stops mattering to you.
- **uses** form the *dependency graph*. A node sees only the `what` of the
  nodes it uses, never their `how`. That is encapsulation, enforced by the
  compiler rather than by convention.

### Folders, splitting and reuse

A spec can be one file or many. The spec lives in its own folder (the
project's `specRoot`, `ail/` in both examples), apart from generated code and
tests. Any `.ail.md` file in any subfolder of it takes part, and **the folders
mirror the tree**:

```
ail/tictactoe.ail.md                                 TicTacToe (product)
ail/app/app.ail.md                                   App: switches areas
ail/app/play/play.ail.md                             the play area
ail/app/demo/demo.ail.md                             the watch area
ail/board/board.ail.md                               BoardKit (library): BoardView, StatusLine
ail/engine/engine.ail.md                             Engine (library): GameState, Rules, GameReducer
ail/engine/computer-player/computer-player.ail.md    grew big, so it got its own folder
```

Node folders are measured from `specRoot`, so `ail/app/play/` generates
`src/gen/app/play/`. Moving the spec folder changes no compile hash.

- **Generated code mirrors the folders.** The target's paths use `{dir}` (e.g.
  `src/gen/{dir}/{kebab}.tsx`). Imports between folders are computed for each
  context, so a model never guesses a relative path.
- **Splitting.** When a node outgrows its size budget (`maxNodeLines`, default
  80), lint asks for it to be split into children in a subfolder. Children
  belong in their parent's folder or below (`misplaced-node`).
- **Reuse: one owner, many users.** A shared node has exactly one place in the
  review tree, usually under a `library` node (a grouping kind that is never
  compiled). Any number of areas list it under `uses`. A product claim may be
  `refined-by` a shared node, as long as some descendant uses it.
- **Changing a shared contract is visible.** Lenses mark shared nodes with
  their users (`Used by PlayAGame (app/play/), WatchADemo (app/demo/)`).
  `ail show changes` lists every node a contract change reaches, so each affected
  area's reviewers see it.
- **Moving is safe.** The output location is part of the compile hash. A node
  that moved shows as `stale (moved from …)`, recompiling removes its old file,
  and `ail build` cleans up the output of nodes that were deleted. Hand-edited
  files are never deleted.

## 3. Levels: one tree, many readers

| level | reader | allowed language |
|---|---|---|
| product | anyone | plain sentences; every claim `refined-by` a descendant |
| experience | design, QA, product | glossary terms, Given/When/Then, look and copy |
| system | generalist engineers | types, contracts, `expr => expected`, decisions |
| specialist | experts | invariants, algorithms, proofs |

Readability and precision don't compete, because they live at different
depths:

- Plain claims are **proven by children**. *"The computer never loses"* is a
  product sentence; the specialist node `ComputerPlayer` makes it true, and a
  derived check enumerates every game to prove it.
- Lint (part of the check that ends every `ail build`) enforces the vocabulary. Code notation (calls,
  operators, camelCase, braces) in `product`/`experience` prose is an error. Notation belongs in `look`, `copy` or `binds`, or one
  level deeper.
- A **glossary** gives each domain word a plain meaning and a formal one, so
  upper levels stay readable without becoming ambiguous.
- Each reader reads down to the level written for them and stops there; the
  levels themselves are the views, so no separate rendering per audience is
  needed.

## 4. How the output becomes deterministic

| Lever | Mechanism |
|---|---|
| The `target` | Every convention a model would otherwise pick itself (language, framework, file layout, naming, styling, exports, comments) is written once in the project's root spec, and reviewed like the rest of it. |
| Closed vocabularies | Design tokens, component nodes, `copy` keys. "A bit of padding" becomes `space.4`. |
| Executable `what` | `expr => expected` examples are translated mechanically into tests. Scenarios and `verify` items become derived checks, generated once, reviewed, and pinned to a hash of the spec. |
| Explicit freedom | Anything not in `free` must follow from the spec. Otherwise the compiler replies `STOP: <question>` instead of guessing. |
| Encapsulated context | Each leaf is compiled from a small, fixed slice of the spec. A smaller context means less variance. |
| Content hashing | Canonical forms ignore comments, whitespace and section order. Cosmetic edits never recompile anything; changing a dependency's `how` doesn't recompile its dependants. |
| Divergence sampling | `ail build --samples N` compares N samples × M models on verification, export surface and `probes`. |
| Drift detection | Hand edits to generated code are caught by the lock file. A hook blocks them, and CI fails on them. The fix is a spec change and a rebuild. |

## 5. The toolchain: skills teach, tools decide, hooks enforce

The surface is deliberately small:

| Piece | Job |
|---|---|
| `ail build` | Compile what changed, then check: is the spec sound (lint), is everything built from it (plan), does it pass (verify), and does each screen match its look? With nothing to compile it needs no model. `--samples N` adds divergence sampling. |
| `ail build` | Write the token CSS, prune what was removed, derive tests from scenarios, then compile every node that changed (independent nodes in parallel). |
| `ail show` | The tree, a node, or the changes (a semantic diff against a git ref). |
| MCP server | two tools: `ail_show`, and `ail_build` (the same build as the CLI) |
| Plugin | for Claude Code, Cursor and GitHub Copilot (CLI and VS Code): the `ail` skill, the `build` and `adopt` commands, the MCP server, and hooks that block edits to generated files and lint every `.ail.md` edit |
| GitHub Action | `ail build`, plus the spec changes in the job summary |

Plumbing for the plugin (`ail mcp`, `ail hook`) stays out of the main help.

### Running on a Claude subscription

No API key is required. `ail build` (and `/ail:build`, which runs the same
build through the plugin's MCP server) uses whatever Claude Code is logged in
with: the `claude-code` provider runs `claude -p` as a pure completion.
Built-in tools, MCP and slash commands are off, and it runs in an empty
directory, so no CLAUDE.md or project file leaks into a node's context.
  It is the default model when `ANTHROPIC_API_KEY` is not set. In CI, give
  Claude Code a token from `claude setup-token` as `CLAUDE_CODE_OAUTH_TOKEN`.

The same holds on a Cursor or Copilot subscription. The `cursor` provider
runs `cursor-agent -p --mode ask` and the `copilot` provider runs
`copilot -s`, both from an empty directory with the system prompt first and no
custom instructions. Without an API key, the default is the first agent CLI
installed. The one the plugin runs in goes first, because each plugin's MCP
config sets `AIL_HOST`.

The compile loop is ordinary code, so it behaves the same whichever vendor
fills in the leaves:

```
for node in dependency order:
  if lock[node] == hash(context(node)): skip          # cache hit
  reply = model(skill, context(node))                 # any vendor
  if reply is STOP(question): report it — the spec must answer
  submit: write → verify → lock, or roll back and retry with the failures
```

The only outputs that need no model are the design-token CSS, written straight
from the catalog, and, when a project sets `specModule`, a data module holding
spec files (of this project, or of several listed projects). The website uses
it for its spec browser, which opens the site's own spec and the Tic-Tac-Toe
spec in a read-only Monaco editor, so it can never go stale; `ail build` fails its check if either output is
out of date. Everything else, the entry point and the components
included, is a node compiled like any other.

### Why there are no profiles

An earlier version had *profiles*: named, shareable packages of conventions,
components, templates and golden examples, looked up by id. Every project used
the same one, so it was a reuse mechanism with a single user. Now:

- the conventions are a `target` block in the project's own spec
- the components are ordinary nodes in a `library`
- the design tokens are the project's own `catalog`
- `index.html` is a normal hand-written file
- the golden examples are gone; `ail build --samples` shows whether that costs
  determinism

Sharing conventions across projects means copying a `target` block, which is
fine until a second team actually needs more.

## 6. Evidence so far

All of this is in this repository and can be re-run:

- **The kata compiles and verifies end to end.** `examples/tictactoe` has two
  areas (play and watch) that share a board kit and an engine, with 11
  compiled nodes across 6 folders plus glue. 24 example tests and 22 derived
  checks pass (46 in all), including an exhaustive "computer never loses" proof
  and a typecheck. The app runs with `bun run dev`.
- **It runs on a subscription.** With no API key set, `ail build` used Claude
  Code's login and compiled `WatchADemo` and `ComputerPlayer` on the first try,
  with correct imports across folders. (An earlier version of the plugin
  compiled through a restricted subagent; it now runs this same build.)
- **A real model passes on the first try.** In a scratch copy, `ail build
  ComputerPlayer --force --model "command:claude -p"` produced a textually
  different implementation (negamax instead of a min/max split) that passed the
  same checks on attempt 1.
- **Real samples converge.** `ail build ComputerPlayer Rules --samples 2`
  converged: every sample verified and every probe agreed.
- **Ambiguity becomes a question, not a coin flip.** With the tie-break rule
  removed from `ComputerPlayer`, all 3 samples refused to guess. Each replied
  `STOP:` and asked which index wins when several moves score the same.

## 7. Open questions

- **Probes for views.** `diverge` compares views on verification and export
  surface. Rendering the DOM for probes is the next step.
- **Derived checks are a trust boundary.** They are generated once and then
  pinned. They should get their own review lens, because they decide what
  "correct" means.
- **Multi-file nodes.** Today one node maps to one module. Some targets need a
  node to own a set of files.
- **Namespaces.** Node names are unique across the whole project. Large
  projects may want folder-qualified names (`board.BoardView`).
- **A backend target.** An HTTP + database project would test whether the
  approach holds outside the UI.
- **Self-hosting.** Specifying the `ail` toolchain in AIL would be a real test
  of the format.
