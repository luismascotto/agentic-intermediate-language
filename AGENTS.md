# Agent instructions

## In any AIL project (a folder with `ail.config.json`)

- The `*.ail.md` files are the source of truth. Generated code (the target's
  `generated` globs, e.g. `src/gen/**`) is never edited by hand: hooks block
  it, and `ail build` reports it.
- To change behaviour, change the spec, then build: the plugin's `build`
  command (`/ail:build` in Claude Code), or `ail build` in a terminal.
- If the spec leaves something open and it isn't in `free`, stop and ask for a
  spec change. Never guess in code.
- Before finishing, `ail build` (or `/ail:build`) must pass: it compiles what
  changed and then checks everything.

## In this repository (the toolchain)

- Use Bun for everything. Run `bun install && bun link` once, then
  `bun test` and `bun run typecheck`. Example projects depend on the linked
  `ail`.
- `bun test` includes end-to-end checks of `examples/tictactoe`, which needs
  `bun install` in that folder first. `examples/connect4` is a second kata;
  install there the same way when working on it.
- `site/` is the website, and it is an AIL project. Change its pages through
  its spec in `site/ail/` and `ail build`, never by editing `site/src/gen`.
  Its spec browser (a read-only Monaco editor) shows `site/src/gen/spec.ts`,
  which `ail build` writes without a model from `site/ail/` and the example
  specs under `examples/*/ail/` (including Tic-Tac-Toe and Connect 4). So after
  editing a kata's spec, also run `ail build` in `site/` (no model calls are
  needed for that), or the site's build fails its check.
- The plugin ships to Claude Code (`.claude-plugin/`, `hooks/hooks.json`),
  Cursor (`.cursor-plugin/`, `hooks/cursor.json`) and GitHub Copilot
  (`.github/plugin/`, `hooks/copilot.json`). They share `skills/`,
  `commands/` and `src/mcp.ts`, so a change to one surface reaches all three.
  `tests/agents.test.ts` runs each agent's hooks.
- If you change the prompts or the context format, compile hashes
  change. Rebuild `examples/tictactoe` and `site` so that `ail build` passes in
  both.
