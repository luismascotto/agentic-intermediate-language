---
name: ail
description: Work with AIL (*.ail.md), the why/what/how specification that agents compile into code. Use when adding or changing a feature in a project with ail.config.json, answering a STOP question from the compiler, reviewing a change to *.ail.md files, or bringing existing code under AIL. Edit the spec, never the generated code.
---
# AIL

An AIL spec is a tree of nodes. Each node says **why** it exists, **what** it
does observably, and **how** its key decisions were made. Detail is delegated
to children. People review the spec; generated code (the target's `generated`
paths) is never edited by hand, and hooks block attempts to.

Tools: `ail_show` looks at the spec (the tree, a node, or what changed); `ail_build` builds it, then checks everything (the `build`
command calls it: `/ail:build` in Claude Code); `ail_adopt` checks a running app against the spec.

## Node shape
```ail
node Name : kind   level: product|experience|system|specialist   @tag
  why       rationale   <- AncestorName
  what      the observable contract: claims, types, signatures, constants, Scenario: …, examples, probes
  how       decide X
              because Y
              rejected Z because W
  look      layout and visuals, in design tokens and component nodes
  copy      key "user-visible text"
  binds     props, state and events that connect a view to logic
  free      [ the only things the compiler may choose ]
  uses      nodes whose contract this one depends on
  children  nodes that refine this one
  verify    properties that need a derived check
  sources   where the claims came from (tickets, interviews, screens, code); for review, never compiled
```
Kinds: `system` (the root, with `entry`), `flow`, `view`, `data`, `fn`, and
`library` (groups shared nodes; it is never compiled).

The project's root file also holds:
- `target`: what to generate and the conventions every compiler follows,
  including language, structure, naming, styling, and where each kind of node
  is written (`path.view src/gen/{dir}/{kebab}.tsx`)
- `catalog tokens`: the design tokens, the only values `look` may use
- `glossary`: domain words with a plain and a formal meaning

Components (buttons, layout boxes, text styles) are ordinary nodes, usually
in a `library`. A `look` that mentions one must list it under `uses`.

## One notation, for every target
A spec never uses a programming language's syntax or conventions: the same
spec compiles to TypeScript, C#, Swift or Python, and each compiler translates
AIL into its target's own types, naming and idioms. The full definition is
[docs/language.md](../../docs/language.md); in short:
- types: `text`, `number`, `integer`, `boolean`, `duration`, `time`, `bytes`,
  `list of T`, `set of T`, `map of K to V`, `T or nothing` (`T?`),
  `{ field: T }`, `"a" | "b"`, `(T) -> U`, and `later T` for a result that
  arrives later
- values: `nothing`, `[1, 2]`, `{ kind: "won" }`, `40 ms`; `is`, `and`, `or`, `not`
- `binds`: `state reader: text, starting at "stakeholder"`, never a framework's
  hook. The framework is named once, in `target`
- never `string`, `int`, `null`, `T[]`, `List<T>`, `Task<T>`, `interface`,
  `public`, lambdas, `.Select(…)` or `.map(…)`, `==` or `&&`

A node's sections are only those above, and `what`'s only labels are
`examples` and `probes`. `ail build` rejects anything else
(`unknown-section`, `unknown-label`, `target-syntax`).

## Levels: who reads what
| level | reader | language |
|---|---|---|
| product | anyone | plain sentences; each claim ends `refined-by: Node` |
| experience | design, QA, product | glossary words, Given/When/Then, look and copy |
| system | engineers | types, contracts, `expr => expected` examples, decisions |
| specialist | experts | invariants and algorithms |

A child is never less detailed than its parent. Jargon and code notation are
lint errors in product and experience prose. Put notation in `look`, `copy`
or `binds`, or move it one level down. Define domain words once in the
`glossary`.

## Folders, splitting and reuse
- The spec lives in its own folder (the config's `specRoot`, usually `ail/`),
  with nothing else in it. Generated code and checks sit outside it.
- A node lives in its parent's folder or below it, so the folders read like the
  tree. Generated code mirrors the folders.
- A node over the size budget gets split into children in a subfolder named
  after it.
- To share a node, give it one owner (a `library` node, e.g. `board/`) and
  list it under `uses` everywhere it's needed. Never give it two parents.

## Pinning behaviour, so every model writes the same thing
- Examples are the cheapest pin: `evaluate(boardFrom("XXX/OO_/___")) => { kind: "won", mark: "X", line: [0, 1, 2] }`.
- Name every export, with its signature, that a dependant or a test will use.
  Write it straight into `what`, in AIL notation (there is no `exports`
  label): `type Action = { id: text, order: integer, run(item: Item) -> later nothing }`,
  `available(item: Item) -> list of Action`, `LINES: list of list of integer = […]`.
- Whenever more than one answer is correct, state the tie-break.
- When a scenario's outcome depends on its data, put the values in its Given
  ("Given a basket with a 199 kr lamp and a 499 kr rug, Then the total reads
  698 kr"). When the outcome doesn't depend on them ("Given a full basket"),
  leave them out: the test chooses. Test data has no section of its own; the
  scenarios are its one source of truth.
- `free` is a whitelist. List suspected gaps under `probes`.
- Give every decision a `because`, and record the real alternatives as `rejected`.

## Workflows
**Change behaviour.** Edit the `.ail.md` file. Start at the highest level the
change affects and refine downwards. The post-edit hook lints the spec. Then
run `/ail:build`, which ends by checking everything.

**A STOP question.** The compiler refused to guess. Answer the question in the
spec (an example, a tie-break, or a `free` entry), then rebuild. Never answer
it in code.

**Review a change.** `ail_show` with `changes` lists the nodes whose meaning
changed, grouped by level, with their why chains and every node a contract
change reaches. For each node, ask:
- Is every new behaviour pinned?
- Does every decision have a `because`?
- Did `free` grow?
- Is every product claim still refined?

Screens are compared too: every build has a model check the final screen of
each scenario against the node's `look` and `copy`, and the screenshots it
judged are in `.ail/look/`. A screen that is wrong while every check passes
means the `look` is missing something. On pull requests, the GitHub Action
posts the review with screenshots as a comment, so there is nothing to attach
by hand.

Don't review generated code. If it's wrong, the spec is missing something.

**Bring an existing app under AIL** (`/ail:adopt`). Write the spec in reverse,
one slice at a time: the why from tickets and the people who own it, the what
from driving the running app, the how from its code, each node with
`sources`. Trace real values into examples. When nobody can confirm a reason,
write `because "unknown, confirm with the owner"`; never invent one. Find out
yourself how the app starts, whatever its platform, along with the services it
needs, and record it in `ail.config.json` under `run.legacy`, with a `seed` that
creates test data through the app's own API, never its database. Each flow gets an end-to-end check in
`checks/e2e/` that drives the app with what suits it (a browser, a simulator,
a process), and `ail_adopt` proves the spec describes the app. Later, with
`run.app` recorded, every build runs the same checks against the rebuilt app.
