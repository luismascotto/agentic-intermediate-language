# The AIL language

This is the definition of AIL: what a spec file may contain, what each part
means, and the one notation every spec uses for types, signatures and values.
`ail build` enforces it. A spec that breaks a rule here fails the build with
the rule's code, given in brackets below (for example `[unknown-section]`).

AIL is written for every target at once. The same spec can be compiled to
TypeScript today and to C#, Swift or Python tomorrow, so it never uses any
programming language's syntax or conventions. It has its own small notation
(below), and each compiler translates it into its target's own conventions:
its types, its naming, its collections, its way of handling absence and
results that arrive later. How the target spells things is said once, in the
`target` block, and nowhere else.

## 1. Files

- A spec is every `*.ail.md` file under the project's `specRoot` (`ail.config.json`).
- Only fenced blocks tagged `ail` carry meaning. Everything else in the file
  is Markdown commentary for people, and no compiler reads it.
- Inside a block, a line at column 0 starts a **statement**, and the indented
  lines below it are its body. A body is a list of **sections**: a keyword at
  the body's base indent, its inline text, and more-indented continuation
  lines.
- `;` after whitespace, outside double quotes, starts a comment that runs to
  the end of the line.
- Folders mirror the tree: a node lives in its parent's folder or below it
  `[misplaced-node]`, and generated code mirrors the folders.

## 2. Statements

There are four statements `[parse]`.

### `target`
Settings, one per section: `code`, `libs`, `styling`, `path.<kind>`,
`generated`, `tokens-css`, `tests` and any convention the project wants
every compiler to follow (naming, exports, state, effects, comments,
formatting). This is the only place a programming language, a framework or a
library is named. A project has one target `[no-target]`.

### `catalog`
`tokens` followed by `name=value` pairs: the design tokens, the only values a
`look` may use `[unknown-token]`.

### `glossary`
One `term <word> plain "<everyday meaning>" formal <meaning in AIL notation>`
per line. A plain-language level uses these words instead of jargon.

### `node`
```ail
node Name : kind   level: product|experience|system|specialist   @tag …
```
- `Name` is a word in UpperCamelCase, unique in the project.
- `kind` is one of:
  - `system`: the root, with an `entry`
  - `flow`: a stateful part that runs a use case
  - `view`: what is shown
  - `data`: types and the functions that make them
  - `fn`: logic
  - `library`: groups shared nodes and is never compiled
- `level` says who reads the node `[missing-level]`. A child is never less
  detailed than its parent `[level-order]`.

| level | reader | language |
|---|---|---|
| product | anyone | plain sentences; each claim ends `refined-by: Node` |
| experience | design, QA, product | glossary words, Given/When/Then, look and copy |
| system | engineers | AIL notation: types, signatures, examples, decisions |
| specialist | experts | invariants and algorithms |

Product and experience prose has no code notation at all
`[code-in-plain-level]`. Notation goes in `look`, `copy` or `binds`, or one
level down.

## 3. Sections

A node has these sections and no others `[unknown-section]`.

| section | holds | contract? |
|---|---|---|
| `why` | the reason the node exists, ending `<- Ancestor` | read by compilers, not checked |
| `what` | the observable contract (section 4) | yes: examples, scenarios and verify items are its checks |
| `how` | decisions: `decide …`, `because …`, `rejected … because …` | followed literally |
| `look` | layout and visuals, in tokens and component nodes | yes: screenshots are judged against it |
| `copy` | `key "user-visible text"`, verbatim | yes |
| `binds` | what connects a view to logic: `props`, `state`, `events` and named hooks into the platform | yes |
| `free` | `[ a, b ]`: the only choices left to the compiler | the whitelist |
| `uses` | nodes whose `what` this node depends on | dependency graph |
| `children` | nodes that refine this one | review tree |
| `verify` | properties that need a derived check | yes |
| `entry` | the node a `system` starts with | |
| `sources` | where the claims came from: tickets, interviews, screens, code | provenance: never compiled, hashed or judged |

A node sees only the `what` of the nodes it `uses`, never their `how`.

## 4. `what`

`what` is a list of items. An item is a line at the section's indent plus
the lines indented under it. Each item is one of these:

- **A claim**: a sentence. At the product level it ends `refined-by: Node, …`
  `[missing-refinement]`.
- **A type**: `type Name = <type>` (section 5). It is exported.
- **A signature**: `name(param: Type, other: Type = default) -> Type`,
  optionally followed by `— what it does`, or by indented lines that say
  how it behaves. It is exported.
- **A constant**: `NAME: Type = value`. It is exported.
- **A scenario**: `Scenario: <title>` with indented `Given`, `When`, `Then`
  and `And` lines.
- **`examples`**, with one `expression => expected` per indented line
  `[example-syntax]`. Each one is an executable check.
- **`probes`**, with one expression per indented line: inputs whose answer
  the spec doesn't pin yet, listed so a reviewer sees the gap.

There is no other label `[unknown-label]`. In particular there is no
`exports`: every type, signature and constant written in `what` is the
node's public surface, and a helper that isn't named there is private (list
`helper names` under `free` if their names are the compiler's choice).

## 5. The notation

The notation is the same in `what`, `how`, `binds` and `verify`. It never
uses a programming language's syntax `[target-syntax]`.

### Types
| AIL | means |
|---|---|
| `text` | a string of characters |
| `number` | any number; `integer` for whole numbers |
| `boolean` | `true` or `false` |
| `duration` | a length of time, written `40 ms`, `3 s`, `5 min` |
| `time` | a moment, written `2026-11-20 12:57:21` |
| `bytes` | raw binary content |
| `nothing` | no value |
| `list of T` | an ordered list |
| `set of T` | an unordered collection without duplicates |
| `map of K to V` | a lookup from keys to values |
| `T or nothing` | a value that may be absent; `T?` is short for it |
| `"a" \| "b"` | one of these values (a choice) |
| `A \| B` | one of these types |
| `{ field: T, other?: T }` | a record; `?` marks a field that may be absent |
| `{ kind: "won", mark: Mark } \| { kind: "draw" }` | a tagged choice |
| `(T, U) -> V` | a function |
| `later T` | a `T` that arrives later (in a target: a task, a promise, a future, a suspending call) |
| `Name` | a type defined with `type`, or a node |

A record may hold functions, which is how a role that several things fill is
written:
```
type Action = { id: text, order: integer, title(item: Item) -> text, run(item: Item, context: Context) -> later nothing }
```

### Signatures
```
name(param: Type, other: Type = default) -> Type
Owner.name(param: Type) -> Type          — a function that belongs to Owner
```
Results that arrive later are `-> later T`. A function that returns nothing
says `-> nothing`.

### Values
- `"text"`, `42`, `-1.5`, `true`, `false`, `nothing`, `40 ms`
- `[1, 2, 3]` (a list), `{ kind: "won", mark: "X" }` (a record)
- `name(args)` (a call), `a.b` (a field), `list[0]` (the first element; lists
  count from 0)
- `a is b` (the same value; for records and lists, the same object),
  `is not`, `and`, `or`, `not`, and arithmetic `+ - × /` with `<`, `≤`,
  `>`, `≥` for comparisons
- `the same game object`: identity, when it matters, is said in words

### Examples
`expression => expected` compares by value: two records are equal when their
fields are. To name a value both sides use, add `where` after the expected
value:
```
reduce(g, { type: "place", index: 4 }) is g => true   where g = play([4])
```
Examples run mechanically: the toolchain translates them from this notation
into the target's language, so they need no model and never drift.

### Names
Write names as the spec's concepts, in lowerCamelCase for functions, fields
and parameters, UpperCamelCase for types and nodes, and UPPER_CASE for
constants. The compiler spells them the way the target's naming convention
does, mechanically (`boardFrom` stays `boardFrom` in TypeScript and becomes
`board_from` in Python and `BoardFrom` in C#), so every node and every test
compiled for that target agrees on them.

### What is never written
| not this | but this |
|---|---|
| `string`, `int`, `bool`, `double`, `void`, `any` | `text`, `integer`, `boolean`, `number`, `nothing` |
| `null`, `undefined`, `nil`, `None` | `nothing` |
| `Cell[]`, `List<Cell>`, `IEnumerable<Cell>` | `list of Cell` |
| `Task<bool>`, `Promise<T>`, `async` | `later boolean`, `later T` |
| `interface IAction { … }`, `class`, `enum` | `type Action = { … }`, `type Size = "small" \| "large"` |
| `public`, `private`, `static`, `readonly` | nothing: what is in `what` is public |
| `items.Select(a => a.Id)`, `.map(…)` | `the ids of items, in order` |
| `a == b`, `&&`, `\|\|`, `!` | `a is b`, `and`, `or`, `not` |
| `useState(false)`, `React node`, `new Settings()` | `state copied: boolean, starting at false`, `a rendered view`, `defaultSettings()` |
| `const x = …`, `import …` | `X: Type = value`; dependencies go under `uses` |

Platform concepts are not language syntax. A web view's `binds` may say
`aria-label`, `role tab` or `a link to "#journey"`, and a CLI's `what` may
name an exit code, because those are what the user meets on that platform.
How a framework holds them (hooks, components, signals) is the target's
business.

## 6. `binds`

`binds` connects a view to logic in the same notation:
```
props    label: text, options: list of { value: text, label: text }, value: text, onChange(value: text)
state    reader: "stakeholder" | "design", starting at "stakeholder"
events   click sets reader; ArrowRight picks the next reader, wrapping
```
`props` are a view's inputs, `state` is what a flow keeps between events
(with its starting value), and `events` are what the user does and what it
changes. A prop that holds other views is typed `a rendered view` (or, for
what sits inside a view, `children`). Other keys name a hook
into the platform (`svg`, `hash`, `tablist`) and say what it does in words.

## 7. Checks
- An example is compiled into a test for the node.
- Each scenario and each `verify` item becomes a test in `checks/`, derived
  once and pinned to the spec's hash.
- A view with a `look` gets screenshots of each test's final screen, judged
  against the `look` and `copy`.
- A flow may also have an end-to-end check in `checks/e2e/` that drives the
  running app.

## 8. Editors

[`editors/vscode`](../editors/vscode) holds a TextMate grammar for this
language (`source.ail`) and the VS Code extension that uses it. It colors
`.ail.md` files and every ```` ```ail ```` block in Markdown.
