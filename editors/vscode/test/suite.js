// Runs inside VS Code, with examples/tictactoe open: Go to Definition and Find
// All References on node names, through VS Code's own commands, exactly as
// F12 and Shift+F12 call them.
"use strict";
const assert = require("node:assert");
const vscode = require("vscode");

async function open(rel) {
  const [uri] = await vscode.workspace.findFiles(rel);
  assert.ok(uri, `${rel} is in the workspace`);
  return vscode.workspace.openTextDocument(uri);
}

/** The position of the nth whole-word `word` on the first line matching `lineRe`. */
function at(doc, lineRe, word, nth = 0) {
  for (let i = 0; i < doc.lineCount; i++) {
    const text = doc.lineAt(i).text;
    if (!lineRe.test(text)) continue;
    let from = -1;
    for (let k = 0; k <= nth; k++) from = text.indexOf(word, from + 1);
    if (from >= 0) return new vscode.Position(i, from + 1);
  }
  throw new Error(`no ${word} on a line matching ${lineRe}`);
}

const where = (loc) => `${vscode.workspace.asRelativePath(loc.uri ?? loc.targetUri)}:${(loc.range ?? loc.targetRange).start.line + 1}`;
const lineOf = async (loc) => (await vscode.workspace.openTextDocument(loc.uri ?? loc.targetUri)).lineAt((loc.range ?? loc.targetRange).start.line).text;

async function run() {
  const play = await open("ail/app/play/play.ail.md");
  await vscode.window.showTextDocument(play);
  const ext = vscode.extensions.all.find((e) => e.packageJSON.name === "ail" && e.packageJSON.publisher === "ffMathy");
  assert.ok(ext, "the AIL extension is loaded");
  await ext.activate();

  const cases = [
    // [what, line, word, the file and header it must land on]
    ["uses, to another folder", /^\s+uses\s/, "GameReducer", "ail/engine/engine.ail.md", "node GameReducer "],
    ["uses, to a library component", /^\s+uses\s/, "Stack", "ail/ui/ui.ail.md", "node Stack "],
    ["why <- the parent, in another file", /<-\s*App/, "App", "ail/app/app.ail.md", "node App "],
    ["a component in a look", /^\s+layout\s/, "BoardView", "ail/board/board.ail.md", "node BoardView "],
    ["a node in the same file", /^\s+children\s/, "NewGameButton", "ail/app/play/play.ail.md", "node NewGameButton "],
  ];
  for (const [what, lineRe, word, file, header] of cases) {
    const found = await vscode.commands.executeCommand("vscode.executeDefinitionProvider", play.uri, at(play, lineRe, word));
    assert.strictEqual(found.length, 1, `${what}: one definition of ${word}, got ${found.map(where).join(", ") || "none"}`);
    assert.strictEqual(vscode.workspace.asRelativePath(found[0].uri ?? found[0].targetUri), file, what);
    assert.ok((await lineOf(found[0])).startsWith(header), `${what}: lands on "${header}"`);
    console.log(`✓ Go to Definition, ${what}: ${word} → ${where(found[0])}`);
  }

  const quoted = await vscode.commands.executeCommand("vscode.executeDefinitionProvider", play.uri, at(play, /"New game"/, "New"));
  assert.strictEqual(quoted.length, 0, "quoted text names no node");
  console.log("✓ quoted text names no node");

  const refs = await vscode.commands.executeCommand("vscode.executeReferenceProvider", play.uri, at(play, /^\s+uses\s/, "GameReducer"));
  const files = [...new Set(refs.map((r) => vscode.workspace.asRelativePath(r.uri)))].sort();
  assert.deepStrictEqual(files, ["ail/app/demo/demo.ail.md", "ail/app/play/play.ail.md", "ail/engine/engine.ail.md"], "GameReducer is used by both areas and defined in the engine");
  console.log(`✓ Find All References: GameReducer in ${files.join(", ")} (${refs.length} places)`);
}

module.exports = { run };
