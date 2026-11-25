# Using AIL with GitHub Copilot

AIL is a GitHub Copilot plugin too, from the same repository as the Claude
Code and Cursor plugins. It works in the Copilot CLI and in VS Code's agent
plugins. It has the same skill, commands, MCP tools and hooks. Builds run on
your Copilot subscription through the Copilot CLI, so no API key is needed.

You need [Bun](https://bun.sh) 1.2 or later.

## Copilot CLI

```bash
copilot plugin marketplace add ffMathy/agentic-intermediate-language
```

```bash
copilot plugin install ail@agentic-intermediate-language
```

Or use `/plugin` inside `copilot`. Copilot reads the plugin from
[`.github/plugin/plugin.json`](../.github/plugin/plugin.json), and the
marketplace from `.claude-plugin/marketplace.json`, which it shares with
Claude Code.

The plugin has no pinned version, so every merge to `main` is a new version.
To update:

```bash
copilot plugin update ail
```

## VS Code

Agent plugins in VS Code read the Claude Code format, so the same marketplace
works there. In your settings:

```json
{
  "chat.plugins.enabled": true,
  "chat.plugins.marketplaces": ["ffMathy/agentic-intermediate-language"]
}
```

Then install `ail` from Agent Customizations → Plugins. To color AIL as well,
install the [VS Code extension](../editors/vscode).

## Building

To build, the plugin calls `ail_build`. Its MCP server is started with
`AIL_HOST=copilot`, so without `ANTHROPIC_API_KEY` it compiles with the
Copilot CLI when that is installed:
- every node gets its own `copilot -s` call
- each call runs from an empty folder, with no custom instructions and no
  tools allowed, so it sees only that node's slice of the spec
- screenshots that a model judges against a `look` are attached with
  `--attachment`

If the Copilot CLI isn't installed, the build uses Claude Code or the Cursor
CLI instead. Log in once with `copilot login`, or set `COPILOT_GITHUB_TOKEN`
in CI. To choose a model, set `models` in `ail.config.json`, for example
`["copilot:gpt-5"]`.

## What the plugin adds

| | Name | What it's for |
|---|---|---|
| Command | `build [Node…]` | Compile everything that changed, then check everything |
| Command | `adopt` | Bring an existing app under AIL: its spec from its tickets, its people, the running app and its code, then proof that the spec describes it |
| Skill | `ail` | How to write, split, share and review nodes. Copilot loads it when you work on `*.ail.md` files |
| MCP tools | `ail_show`, `ail_build`, `ail_adopt` | Look at the spec (the tree, a node, or what changed), build it, and check a running app against it |
| Hooks | — | Block edits to generated files, and lint the spec after every `.ail.md` edit |

## Hooks

In the Copilot CLI, [`hooks/copilot.json`](../hooks/copilot.json) runs
`ail hook pre|post --for copilot` around the `edit` and `create` tools, from
bash or PowerShell:
- Before the edit, an edit to generated code is denied with
  `permissionDecision: "deny"`.
- After it, lint problems go back as `additionalContext`.
- If Bun or the plugin's folder can't be found, the hook lets the edit
  through rather than block every edit.

VS Code runs the Claude Code hooks in [`hooks/hooks.json`](../hooks/hooks.json).

Everything else is as in the [Claude Code guide](claude-code.md): the typical
session, CI, and how to start a new project.
