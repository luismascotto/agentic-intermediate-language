# Using AIL with Claude Code

AIL ships as a Claude Code plugin. Once it's installed, Claude Code writes and
reviews the spec with you, then compiles it, all on your Claude subscription.
No API key is needed.

## Install

The CLI needs [Bun](https://bun.sh) 1.2 or later. Then, in Claude Code:

```
/plugin marketplace add ffMathy/agentic-intermediate-language
```

```
/plugin install ail@agentic-intermediate-language
```

Restart Claude Code so the plugin's tools load.

## Updates

The plugin has no pinned version, so every merge to `main` is a new version
(Claude Code versions it by commit). Claude Code doesn't auto-update
third-party marketplaces unless you turn it on: in `/plugin`, open
Marketplaces, pick `agentic-intermediate-language` and enable auto-update. Or
update by hand:

```
claude plugin update ail@agentic-intermediate-language
```

Then run `/reload-plugins`, or restart Claude Code.

To get AIL colored in VS Code or Cursor as well, install the extension from
[`editors/vscode`](../editors/vscode).

The same plugin also runs in [Cursor](cursor.md) and in
[GitHub Copilot](copilot.md).

## What the plugin adds

| | Name | What it's for |
|---|---|---|
| Command | `/ail:build [Node…]` | Compile everything that changed, then check everything |
| Command | `/ail:adopt` | Bring an existing app under AIL: its spec from its tickets, its people, the running app and its code, then proof that the spec describes it |
| Skill | `ail` | Loaded automatically when you work on `*.ail.md` files: how to write, split, share and review nodes |
| MCP tools | `ail_show`, `ail_build`, `ail_adopt` | Look at the spec (the tree, a node, or what changed), build it, and check a running app against it |
| Hooks | — | Block edits to generated files, and lint the spec after every `.ail.md` edit |

That's the whole surface: two commands for you, the rest for Claude. To look
at the spec, ask in plain words ("show me the tree", "what
changed?"), and Claude calls `ail_show`.

## A typical session

1. **Ask for a feature in plain words.** For example: *"Add a scoreboard that
   counts wins for X and O across games."* The `ail` skill makes Claude change
   the spec, not the code. It starts at the highest level the change affects
   (a product claim, an experience scenario) and refines downwards until every
   leaf has examples that pin its behaviour. The post-edit hook rejects jargon
   in plain-language levels, missing refinements, and unknown design tokens.
2. **Review the spec, not the code.** Ask what changed: you get the nodes
   whose meaning changed, grouped by level, each with its why chain and every
   area a shared contract change reaches. Each reader stops at the level
   written for them: a stakeholder reads the product level, an engineer goes
   down to the contracts.
3. **Build.** Run `/ail:build`. It runs the same build as `ail build` in a
   terminal: every node that isn't up to date is compiled by `claude -p` with
   your login, with no tools, in an empty folder, so it sees only that node's
   slice of the spec. Code is kept only if every check passes, and for nodes
   with a `look`, only if a model finds that the final screen of each
   scenario matches the look (the screenshots are in `.ail/look/`). If the
   spec leaves something open, the compiler stops and asks instead of
   guessing, and you answer in the spec.
4. **Done.** The build ends with a check: the spec is sound, everything is
   built from it, and every test passes.

Try to edit a generated file directly and the hook refuses, pointing you back
to the spec.

## The same project from a terminal or CI

```bash
bun add -g github:ffMathy/agentic-intermediate-language
```

```bash
ail build
```

```bash
ail show changes
```

`ail build` uses Claude Code's login when `ANTHROPIC_API_KEY` isn't set (or, without Claude Code, the Cursor or Copilot CLI's).
Each node is compiled with `claude -p`, with Claude Code's tools disabled and
from an empty directory, so only the node's slice of the spec reaches the
model.

In CI, give Claude Code a token from `claude setup-token` as
`CLAUDE_CODE_OAUTH_TOKEN` if the job needs to build. Usually it doesn't:
commit what `ail build` produced, and let CI run `ail build` through the
bundled GitHub Action:

```yaml
jobs:
  spec:
    runs-on: ubuntu-latest
    permissions:
      contents: write        # screenshots are pushed to the ail-shots branch
      pull-requests: write   # one review comment per project
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: ffMathy/agentic-intermediate-language@main
        with:
          project: path/to/your/project
```

On pull requests, the action comments with the review of the spec changes
and screenshots of the proofs: the final screen of each scenario of every
changed node with a `look`, and of the nodes that use it. Set
`screenshots: false` or `comment: false` to turn either off. On forks, whose
token can't push or comment, those steps only warn.

## Starting a new project

A project is any folder with an `ail.config.json`. Keep the spec in its own
folder:

```json
{ "specRoot": "ail" }
```

```
my-app/
  ail.config.json
  ail/            the spec: every .ail.md file, nothing else
  src/gen/        generated code, mirroring ail/'s folders
  checks/         derived checks, mirroring ail/'s folders
  index.html      hand-written
```

The root spec file (e.g. `ail/my-app.ail.md`) holds a `target` (what to generate, and the conventions
to follow), the design tokens, and the root node with its entry point:

````md
```ail
target
  code        TypeScript 5 strict, React 19 function components, named exports only
  styling     inline styles; design tokens as CSS variables (token a.b.c → "var(--a-b-c)")
  path.system src/gen/main.tsx
  path.view   src/gen/{dir}/{kebab}.tsx
  path.flow   src/gen/{dir}/{kebab}.tsx
  path.fn     src/gen/{dir}/{kebab}.ts
  libs        react react-dom
  tokens-css  src/gen/tokens.css
  generated   src/gen/**
```

```ail
catalog
  tokens
    space.2=8px  color.text=#111827
```

```ail
node MyApp : system   level: product
  why   …
  what
    1. …   refined-by: Home
  entry     Home
  children  Home
```
````

Ask Claude to flesh it out. The `ail` skill knows the format, and
[`examples/tictactoe`](../examples/tictactoe) is a complete reference.
