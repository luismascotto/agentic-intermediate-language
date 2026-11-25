# Using AIL with Cursor

AIL ships as a Cursor plugin, from the same repository as the Claude Code
plugin. It has the same skill, commands, MCP tools and hooks. Builds run on
your Cursor subscription through the Cursor CLI, so no API key is needed.

## Install

You need [Bun](https://bun.sh) 1.2 or later, and Cursor 2.5 or later.

**For yourself.** Clone the plugin into Cursor's local plugin folder:

```bash
git clone https://github.com/ffMathy/agentic-intermediate-language ~/.cursor/plugins/local/ail
```

Then run **Developer: Reload Window**.

**For your team** (Teams and Enterprise). In the Cursor dashboard, open
Plugins & MCPs → Team Marketplaces → Add Marketplace → Import from Repo. Paste
`https://github.com/ffMathy/agentic-intermediate-language`. Its marketplace is
[`.cursor-plugin/marketplace.json`](../.cursor-plugin/marketplace.json).
Everyone can then install `ail` from Customize, for a project or for
themselves.

To build without a Cursor window open (from a terminal, or when Claude Code
isn't installed), install the [Cursor CLI](https://cursor.com/docs/cli) and
log in once with `cursor-agent login`.

## Updates

The plugin has no pinned version, so every merge to `main` is a new version.
If you cloned it, update it with:

```bash
git -C ~/.cursor/plugins/local/ail pull
```

Then reload the window. A team marketplace picks up `main` on its own.

## What the plugin adds

| | Name | What it's for |
|---|---|---|
| Command | `build [Node…]` | Compile everything that changed, then check everything |
| Command | `adopt` | Bring an existing app under AIL: its spec from its tickets, its people, the running app and its code, then proof that the spec describes it |
| Skill | `ail` | How to write, split, share and review nodes. The agent loads it when you work on `*.ail.md` files |
| MCP tools | `ail_show`, `ail_build`, `ail_adopt` | Look at the spec (the tree, a node, or what changed), build it, and check a running app against it |
| Hooks | — | Block edits to generated files, and lint the spec after every `.ail.md` edit |

Pick the commands from the `/` menu in chat. To look at the spec, ask in
plain words ("show me the tree", "what changed?"), and the agent calls
`ail_show`.

## How it fits together

- **Manifest.** [`.cursor-plugin/plugin.json`](../.cursor-plugin/plugin.json).
  The skill (`skills/`) and the commands (`commands/`) are shared with
  Claude Code and Copilot.
- **Hooks.** [`hooks/cursor.json`](../hooks/cursor.json) runs
  `ail hook pre|post --for cursor` before and after every `Write`:
  - Before the write, an edit to generated code is denied with
    `{"permission": "deny"}`.
  - After it, lint problems in the spec go back to the agent as
    `additional_context`.
- **MCP.** The server is started with `AIL_HOST=cursor`. So without
  `ANTHROPIC_API_KEY`, `ail_build` compiles with the Cursor CLI when it is
  installed:
  - every node gets its own `cursor-agent -p --mode ask` call
  - each call runs from an empty folder, so it sees only that node's slice of
    the spec
  - if the Cursor CLI isn't installed, the build uses Claude Code or the
    Copilot CLI instead

  To choose a model, set `models` in `ail.config.json`, for example
  `["cursor:sonnet-4"]`.

Everything else is as in the [Claude Code guide](claude-code.md): the typical
session, CI, and how to start a new project.
