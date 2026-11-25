# AIL — Agentic Intermediate Language

![AIL: write the spec, let agents build the code, prove that they agree](docs/cover.png)

**Write the spec. Let agents build the code. Prove that they agree.**

AIL is a recursive *why / what / how* specification. People review the spec:
plain language at the top, precise contracts further down. Any model compiles
it, node by node, and every check the spec implies runs against the result.
The same spec gives the same behaviour whichever model or vendor builds it.

🌐 **Website:** <https://ffmathy.github.io/agentic-intermediate-language/>. The
site is itself written in AIL ([`site/`](site)) and compiled by `ail build`.
It includes a playable demo.

![The Tic-Tac-Toe demo, built entirely from a spec](docs/tictactoe.png)

## Use it in Claude Code

No API key is needed; it runs on your Claude subscription.

```
/plugin marketplace add ffMathy/agentic-intermediate-language
```

```
/plugin install ail@agentic-intermediate-language
```

Then ask for features in plain words. Claude changes the spec, not the code,
and one command does the rest:

| | |
|---|---|
| `/ail:build` | compile whatever changed (each node sees only its own slice of the spec), then check everything |
| `/ail:adopt` | bring an existing app under AIL: see below |

To look at the spec, just ask: "show me the tree", "show me ComputerPlayer",
"what changed?".

Every merge to `main` is a new plugin version. Turn on auto-update for the
marketplace in `/plugin`, or run `claude plugin update ail@agentic-intermediate-language`.

See **[docs/claude-code.md](docs/claude-code.md)** for the full guide.

## Use it in Cursor or GitHub Copilot

The same repository is a Cursor plugin and a GitHub Copilot plugin. All three
plugins have the same skill, the same `build` and `adopt` commands, the same
MCP tools and the same hooks. Builds use the login of the agent you work in,
so a Cursor or Copilot subscription works too, with no API key.

**Cursor** (2.5 or later): clone the plugin into Cursor's local plugin folder,
then run **Developer: Reload Window**. Teams can instead import the repository
as a team marketplace.

```bash
git clone https://github.com/ffMathy/agentic-intermediate-language ~/.cursor/plugins/local/ail
```

**GitHub Copilot CLI:**

```bash
copilot plugin marketplace add ffMathy/agentic-intermediate-language
```

```bash
copilot plugin install ail@agentic-intermediate-language
```

**VS Code agent plugins:** add `"chat.plugins.marketplaces":
["ffMathy/agentic-intermediate-language"]` to your settings, then install
`ail` from Agent Customizations.

See **[docs/cursor.md](docs/cursor.md)** and
**[docs/copilot.md](docs/copilot.md)** for the full guides.

## Use it from a terminal

The CLI needs [Bun](https://bun.sh) 1.2 or later.

```bash
bun add -g github:ffMathy/agentic-intermediate-language
```

Then, anywhere inside a project (any folder with an `ail.config.json`):

| | |
|---|---|
| `ail build` | Compile whatever changed, then check everything: the spec is sound, the code is built from it, every check passes, and each screen matches its `look`. With nothing to compile it only checks, without a model, so CI runs it too. Without `ANTHROPIC_API_KEY` it uses the login of Claude Code, the Cursor CLI or the Copilot CLI, whichever is installed; `--model` picks another provider (`claude-code`, `cursor`, `copilot`, `anthropic:`, `openai:` or `command:`). |
| `ail adopt` | Does the existing app behave as its spec says? Starts it as `ail.config.json`'s `run` says, runs each flow's end-to-end check, and stops it. |
| `ail show [what]` | The tree, one node (who uses it, and what a change to it reaches), or `changes`: what changed in meaning since a git ref, as reviewed in pull requests. Add `--shots <dir>` for screenshots of the proofs |

That's the whole tool. Change detection, deriving tests from scenarios,
writing the token CSS, taking the proof screenshots and cleaning up after
moved or deleted nodes all happen inside `ail build`.

Proof screenshots are committed too: every build keeps the final screen of
each check for nodes with a `look`, in `checks/shots/`, next to the checks.
A model has compared each one with the spec's look, so a reviewer sees
exactly what was proven.

## One language, for every target

A spec is written in AIL's own small notation, never in a programming
language's: `list of Cell`, not `Cell[]`; `later boolean`, not `Task<bool>`;
`nothing`, not `null`; `state copied: boolean, starting at false`, not
`useState(false)`. The target is named once, in the spec's `target` block, and
each compiler translates the notation into that target's own types, naming and
idioms. So the same spec compiles to TypeScript today and to Swift or C#
tomorrow. `ail build` rejects target-language syntax, unknown sections and
unknown labels. The full definition is in
[docs/language.md](docs/language.md).

## Highlighting in your editor

The VS Code extension in [`editors/vscode`](editors/vscode) colors AIL in
`.ail.md` files and in every ```` ```ail ```` block in Markdown, in VS Code,
Cursor and github.dev. Go to Definition (F12) and Find All References work on
node names across files: `<- Parent`, `uses`, `children`, `refined-by:` and
components in a `look`. Get `ail.vsix` from the latest `vscode-v…`
[release](https://github.com/ffMathy/agentic-intermediate-language/releases)
and install it with **Extensions: Install from VSIX…**. GitHub itself only
colors languages it has registered in Linguist; its grammar is this one.

## Adopt an existing app

AIL also works in reverse. To bring an existing app under AIL, or to move it to
another technology, write its spec from what already exists, one slice at a
time:

1. **Why**, from its tickets (Asana, Jira, Linear, through Claude's connectors)
   and from interviewing the people who own it. A reason nobody can confirm
   is written down as unknown, and every build lists it until someone answers.
2. **What**, from driving the running app in a browser: every screen, text and
   error path, quirks included.
3. **How**, from its code: data shapes, rules, edge cases and real values as
   examples.
4. **Proof.** Each flow gets an end-to-end check that plays its scenarios with
   whatever drives the app: a browser, a simulator, a process. The agent finds
   out how to start the app and records it under `run` in `ail.config.json`,
   along with the services it needs (a backend, a database), which are
   started first. If something can't run locally, the agent adds what's
   missing. Test data belongs to the use case, so the scenario states it: its
   Given gives the values whenever the outcome depends on them ("a 199 kr lamp
   and a 499 kr rug, Then the total reads 698 kr"). Each test creates its
   own through the app's own API, never directly in its database, so it is
   made the way users make it.
   `ail adopt` starts the old app, runs the checks and stops it, which proves
   the spec describes the old app. Each check also saves a screenshot of the
   screen every scenario ends on, however its platform takes one. `ail adopt`
   commits them in `checks/shots/e2e/` and has a model compare them with the
   spec's `look`. Once everything passes, it records every node in the lock
   file as built by the existing app, so `ail build` only builds what changes
   from then on.

Then change the `target` to the new technology and run `ail build`. Once
`run.app` says how the new app starts, every build runs the same checks
against it, which proves it behaves like the old one. Each node's `sources` section records where its
claims came from, for review.

In Claude Code, `/ail:adopt` does all of this, one slice at a time. So does the `adopt` command in Cursor and Copilot. The
demo has an example check at
[`examples/tictactoe/checks/e2e/`](examples/tictactoe/checks/e2e).

## Try the demo locally

```bash
cd examples/tictactoe
```

```bash
bun install
```

```bash
ail build
```

```bash
ail show
```

```bash
bun run dev
```

## Keep generated code out of pull request diffs

Commit what `ail build` generates, so the app runs straight from the
repository and CI can prove it was built from the spec. But nobody needs to
read it in review. Mark it as generated in `.gitattributes` at the root of the
repository:

```gitattributes
src/gen/** linguist-generated=true
ail.lock.json linguist-generated=true
```

Use your target's `generated` paths, prefixed with the project's folder if it
isn't the repository root. GitHub then collapses those files in every pull
request diff, so reviewers see the spec, the derived checks and the proof
screenshots, while the generated code stays committed. A reviewer can still
expand a collapsed file with "Load diff". A project's first `ail build`, and
`ail adopt`, suggest exactly these lines when they're missing.

## In CI

```yaml
- uses: ffMathy/agentic-intermediate-language@main
  with:
    project: path/to/your/project
```

The action runs `ail build` (which, with nothing to compile, only checks) and puts a review of the spec changes in the job
summary. On pull requests it also keeps one comment per project up to date
with that review and with **screenshots of the proofs**. The screenshots show
the final screen of every scenario of each changed node that has a `look`,
and of the nodes that use it. They are rendered in Chromium from the derived
checks, and the comment shows them through the `ail-shots` branch. Give the
job `contents: write` and `pull-requests: write`, and check out with
`fetch-depth: 0`. To take the same screenshots locally (this needs
Playwright), run:

```bash
ail show changes --shots .ail/shots
```

## How it works

- **A node** states its `why`, its observable `what` (claims, scenarios,
  executable examples), its `how` (decisions, plus the alternatives that were
  rejected), and, for UI, its `look`, `copy` and `binds`.
- **Levels** (`product` → `experience` → `system` → `specialist`) keep the top
  readable by anyone and the bottom precise. Lint enforces the vocabulary at
  each level.
- **Folders mirror the tree.** Shared nodes have one owner (a `library` node)
  and many users through `uses`.
- **Only what changed is rebuilt.** Each node's compile hash covers exactly what
  its compiler sees, and a dependency contributes only its contract. The lock
  file records what produced each generated file, which also catches hand
  edits.
- **Gaps become questions.** A compiler that would have to guess replies
  `STOP: <question>`, and you answer it in the spec.

The spec is a tree of tasks that are all alike, compiled one node at a time,
each by a fresh call that sees only its own slice. The idea is inspired by
[Recursive Language Models](https://arxiv.org/abs/2512.24601) (Zhang, Kraska
and Khattab, MIT CSAIL), where a model calls itself on just the parts of a long
input it needs.

The full design is in [docs/proposal.md](docs/proposal.md), and the language
itself is defined in [docs/language.md](docs/language.md).

## Repository layout

```
src/                 the ail CLI and MCP server (Bun, TypeScript)
prompts/             instructions given to the compiling model
skills/ commands/ hooks/    the agent plugins, shared by:
  .claude-plugin/    Claude Code (and VS Code agent plugins)
  .cursor-plugin/    Cursor
  .github/plugin/    the GitHub Copilot CLI
examples/tictactoe/  the demo: spec in ail/, generated code, derived checks, lock file
examples/connect4/   Connect 4 kata: 6×7 drop game, same layout as the demo
editors/vscode/      the VS Code extension: highlighting, Go to Definition and references for AIL
site/                the website, written in AIL (spec in site/ail/); its spec browser shows both example specs in a read-only Monaco editor
tests/               toolchain tests
```

## Develop

```bash
bun install && bun link
```

```bash
bun test
```

```bash
bun run typecheck
```

Example projects depend on the linked `ail`. `examples/tictactoe` and
`examples/connect4` need `bun install` in those folders before their checks
run. Cursor users: see **[docs/cursor.md](docs/cursor.md)**.
