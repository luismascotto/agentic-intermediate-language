// The part of the extension that knows AIL: where nodes are defined and
// where they are mentioned. Plain functions over text, with no VS Code API,
// so they are tested without an editor (tests/vscode-extension.test.ts).
"use strict";

/** The lines of a file that are AIL: inside ```ail fences in Markdown, or every line of a bare .ail file. */
function ailLines(text, bare) {
  const lines = text.split(/\r?\n/);
  if (bare) return lines.map((_, i) => i);
  const out = [];
  let fence = null;
  lines.forEach((line, i) => {
    if (fence === null) {
      const open = /^\s*(`{3,}|~{3,})\s*ail\b/i.exec(line);
      if (open) fence = open[1];
    } else if (line.trim().startsWith(fence) && line.trim().replace(/[`~]/g, "") === "") fence = null;
    else out.push(i);
  });
  return out;
}

/** Every `node Name` defined in the text: its name and where the name is. */
function definitions(text, bare = false) {
  const lines = text.split(/\r?\n/);
  const out = [];
  for (const i of ailLines(text, bare)) {
    const m = /^node\s+([A-Za-z_]\w*)/.exec(lines[i]);
    if (m) out.push({ name: m[1], line: i, character: m[0].length - m[1].length });
  }
  return out;
}

/** The line with quoted text and a `;` comment blanked out (same length), so neither counts as a mention. */
function code(line) {
  let out = "";
  let quote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { quote = !quote; out += ch; continue; }
    if (!quote && ch === ";" && (i === 0 || /\s/.test(line[i - 1]))) return out + " ".repeat(line.length - i);
    out += quote ? " " : ch;
  }
  return out;
}

/** The word at a position, if it could name a node (it starts with a capital letter). */
function wordAt(line, character) {
  const re = /[A-Za-z_]\w*/g;
  let m;
  while ((m = re.exec(line))) {
    if (m.index <= character && character <= m.index + m[0].length) return /^[A-Z]/.test(m[0]) ? { word: m[0], start: m.index } : null;
  }
  return null;
}

/** The node name at a position in an AIL line of the text, or null (quoted text and comments name nothing). */
function nameAt(text, line, character, bare = false) {
  if (!ailLines(text, bare).includes(line)) return null;
  const hit = wordAt(code(text.split(/\r?\n/)[line]), character);
  return hit ? hit.word : null;
}

/** Every mention of a name in the AIL lines of the text, its definition included. */
function references(text, name, bare = false) {
  const lines = text.split(/\r?\n/);
  const re = new RegExp(`(?<![\\w.])${name}(?!\\w)`, "g");
  const out = [];
  for (const i of ailLines(text, bare)) {
    for (const m of code(lines[i]).matchAll(re)) out.push({ line: i, character: m.index, length: name.length });
  }
  return out;
}

module.exports = { ailLines, definitions, nameAt, references, wordAt };
