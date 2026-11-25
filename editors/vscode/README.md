# AIL for VS Code

Syntax highlighting, Go to Definition and Find All References for [AIL](https://github.com/ffMathy/agentic-intermediate-language),
the Agentic Intermediate Language: the ```` ```ail ```` blocks in `.ail.md`
files (and in any Markdown file), and bare `.ail` files.

It colors statements (`node`, `target`, `catalog`, `glossary`), node names,
kinds and levels, sections (`why`, `what`, `how`, `look`, …), `<- Ancestor`
links and `refined-by:` lists, scenarios and their Given/When/Then steps,
decisions (`decide`, `because`, `rejected`), examples (`=>`), AIL's types
(`text`, `list of T`, `later T`, `nothing`), design tokens, quoted text and
`;` comments. It uses standard scope names, so every color theme shows it.

## Go to Definition and Find All References

On any node name in a spec, **Go to Definition** (F12, or Ctrl/Cmd+click)
opens the file where that node is defined, wherever it is in the workspace,
and **Find All References** (Shift+F12) lists every place that names it. That
covers:
- `<- Engine` in a `why`
- `refined-by: PlayAGame`
- `uses`, `children` and `entry`
- components in a `look`, such as `Button.primary`

Quoted text and `;` comments name nothing. Unsaved edits count. When two
projects in one workspace define the same node, both definitions are offered.

The language itself is defined in
[docs/language.md](https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/language.md).

## Install

Download `ail.vsix` from the repository's latest `vscode-v…`
[release](https://github.com/ffMathy/agentic-intermediate-language/releases)
(each new version in `package.json` is released when it reaches `main`), or
build it:

```bash
cd editors/vscode && bunx @vscode/vsce package --skip-license -o ail.vsix
```

Then, in VS Code, run **Extensions: Install from VSIX…** and pick the file,
or:

```bash
code --install-extension ail.vsix
```

To test it in a real VS Code (downloaded into `.vscode-test/`):

```bash
xvfb-run -a node editors/vscode/test/run.js
```

The same grammar works in Cursor and other editors built on VS Code, and it is
the grammar a future GitHub highlighting submission (Linguist) would use.
