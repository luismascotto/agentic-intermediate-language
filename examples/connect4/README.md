# Connect 4 kata

A second complete AIL example: a 6 × 7 drop game with gravity and four-in-a-row
wins. The whole spec lives in [`ail/`](ail). [`ail/connect4.ail.md`](ail/connect4.ail.md)
is the root, and the folders below it mirror the tree: `app/play` reuses
`board/` and `engine/`. Everything under `src/gen/` is generated, in the same
folders.

| path | what it is | written by |
|---|---|---|
| `ail/**/*.ail.md` | the spec, from product claims down to gravity and win lines | people |
| `src/gen/**/*.ts(x)` | one module per compilable node, in the same folders as its spec | a model, via `ail build` or `/ail:build` |
| `src/gen/tokens.css` | the design tokens as CSS variables | `ail build`, straight from the catalog; no model involved |
| `index.html` | the page that loads the app | people |
| `checks/**/*.test.ts(x)` | derived checks for scenarios and `verify` items, pinned to a spec hash | generated once, then reviewed |
| `checks/e2e/**/*.e2e.ts` | end-to-end checks that play the flow in a browser, against the app `run.app` starts | written once, then reviewed |
| `ail.lock.json` | which compile hash produced which file | `ail` |

```bash
bun install
```

```bash
ail build
```

```bash
bun run dev
```

Unit checks for this kata were run on **Windows**. End-to-end adopt/site flows
that need `sh`/bash were not asserted here.

Things to try:

- `ail show` prints the tree, with each node's status and how many nodes use it.
- `ail show Rules` shows win detection: `LINES`, examples for H / V / both
  diagonals, and the draw board.
- Change a product claim in `Connect4` and run `ail show changes --since HEAD`.
- Drop chips in a column twice and confirm gravity in `GameReducer`'s examples.
- Run `ail build` (or `/ail:build` in Claude Code) to rebuild and check. It
  needs no API key when Claude Code is logged in.
