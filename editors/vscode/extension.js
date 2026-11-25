// AIL for VS Code: Go to Definition and Find All References for node names,
// across every .ail.md (and .ail) file in the workspace. The grammar in
// syntaxes/ does the coloring; nodes.js does the reading.
"use strict";
const vscode = require("vscode");
const { definitions, nameAt, references } = require("./nodes.js");

const GLOB = "**/*.{ail.md,ail}";
const EXCLUDE = "**/node_modules/**";
const isBare = (uri) => uri.path.endsWith(".ail");

/** The text of a file: the open editor's, when it is open, so unsaved edits count. */
async function textOf(uri) {
  const open = vscode.workspace.textDocuments.find((d) => d.uri.toString() === uri.toString());
  if (open) return open.getText();
  return Buffer.from(await vscode.workspace.fs.readFile(uri)).toString("utf8");
}

async function specFiles() {
  return vscode.workspace.findFiles(GLOB, EXCLUDE);
}

/** Where a node is defined. Several places when two projects in the workspace define it. */
async function locate(name) {
  const found = [];
  for (const uri of await specFiles()) {
    for (const d of definitions(await textOf(uri), isBare(uri)))
      if (d.name === name) found.push(new vscode.Location(uri, new vscode.Range(d.line, d.character, d.line, d.character + name.length)));
  }
  return found;
}

const isSpec = (doc) => /\.ail(\.md)?$/.test(doc.uri.path);

function activate(context) {
  const selector = [{ language: "markdown", pattern: "**/*.ail.md" }, { language: "ail" }];

  context.subscriptions.push(vscode.languages.registerDefinitionProvider(selector, {
    async provideDefinition(doc, pos) {
      if (!isSpec(doc)) return [];
      const name = nameAt(doc.getText(), pos.line, pos.character, isBare(doc.uri));
      return name ? locate(name) : [];
    },
  }));

  context.subscriptions.push(vscode.languages.registerReferenceProvider(selector, {
    async provideReferences(doc, pos, ctx) {
      if (!isSpec(doc)) return [];
      const name = nameAt(doc.getText(), pos.line, pos.character, isBare(doc.uri));
      if (!name || !(await locate(name)).length) return [];
      const out = [];
      for (const uri of await specFiles()) {
        const text = await textOf(uri);
        const defs = definitions(text, isBare(uri)).filter((d) => d.name === name);
        for (const r of references(text, name, isBare(uri))) {
          const isDef = defs.some((d) => d.line === r.line && d.character === r.character);
          if (isDef && !ctx.includeDeclaration) continue;
          out.push(new vscode.Location(uri, new vscode.Range(r.line, r.character, r.line, r.character + r.length)));
        }
      }
      return out;
    },
  }));
}

function deactivate() {}

module.exports = { activate, deactivate };
