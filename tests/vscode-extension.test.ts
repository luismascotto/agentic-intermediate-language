// The VS Code extension's Go to Definition and Find All References logic
// (editors/vscode/nodes.js), on every node reference in this repository's specs.
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { loadProject } from "../src/project.ts";
import { KATA } from "./helpers.ts";

const { definitions, nameAt, references } = createRequire(import.meta.url)("../editors/vscode/nodes.js");
const SITE = join(import.meta.dir, "..", "site");

const MD = [
  "# Engine",
  "",
  "node Prose is not AIL, and neither is GameState here.",
  "```ail",
  "node GameReducer : fn   level: system",
  "  why   Keep every rule in one place.   <- Engine   ; Rules, in a comment",
  "  look",
  "    layout   stack(v) [ Button.primary, \"GameState in quotes\" ]",
  "  uses  GameState, Rules",
  "```",
].join("\n");

test("definitions are the node headers inside ```ail blocks only", () => {
  expect(definitions(MD)).toEqual([{ name: "GameReducer", line: 4, character: 5 }]);
  expect(definitions("node A : fn\n  uses B", true)).toEqual([{ name: "A", line: 0, character: 5 }]);
});

test("a name resolves wherever it is code, and nowhere else", () => {
  const at = (line: number, word: string, nth = 0) => {
    const l = MD.split("\n")[line]!;
    let i = -1;
    for (let k = 0; k <= nth; k++) i = l.indexOf(word, i + 1);
    return nameAt(MD, line, i + 1);
  };
  expect(at(5, "Engine")).toBe("Engine");          // <- Ancestor
  expect(at(8, "GameState")).toBe("GameState");    // uses
  expect(at(8, "Rules")).toBe("Rules");
  expect(at(7, "Button")).toBe("Button");          // a component in a look, with its variant
  expect(at(4, "GameReducer")).toBe("GameReducer"); // its own header
  expect(at(5, "Rules")).toBeNull();               // in a ; comment
  expect(at(7, "GameState")).toBeNull();           // in quoted text
  expect(at(2, "GameState")).toBeNull();           // Markdown prose, outside the block
  expect(at(5, "Keep")).toBe("Keep");              // a capitalised word resolves only if a node has that name
});

test("references are every code mention, the definition included", () => {
  expect(references(MD, "GameState")).toEqual([{ line: 8, character: 8, length: 9 }]);
  expect(references(MD, "GameReducer")).toEqual([{ line: 4, character: 5, length: 11 }]);
  expect(references(MD, "primary")).toEqual([]);  // a variant after a dot is not a name
});

test("every node reference in this repository's specs resolves to its definition", () => {
  let checked = 0;
  for (const dir of [KATA, SITE]) {
    const p = loadProject(dir);
    const files = [...new Set(p.ordered.map((n) => n.file))].map((f) => ({ f, text: readFileSync(join(p.root, f), "utf8") }));
    const defined = new Map(files.flatMap(({ f, text }) => definitions(text).map((d: { name: string; line: number }) => [d.name, { f, line: d.line }] as const)));
    expect([...defined.keys()].sort()).toEqual([...p.nodes.keys()].sort());
    for (const n of p.ordered) {
      const text = files.find((x) => x.f === n.file)!.text;
      const lines = text.split("\n");
      const named = [...n.uses, ...n.children, ...(n.why?.ref ? [n.why.ref] : []), ...(n.entry ? [n.entry] : [])];
      for (const name of named) {
        const refs = references(text, name).filter((r: { line: number }) => r.line > n.line - 1);
        expect(refs.length, `${n.name} → ${name}`).toBeGreaterThan(0);
        const r = refs[0]!;
        expect(nameAt(text, r.line, r.character + 1), `${n.name} → ${name} at ${n.file}:${r.line + 1}: ${lines[r.line]}`).toBe(name);
        expect(defined.has(name), name).toBe(true);
        checked++;
      }
    }
  }
  expect(checked).toBeGreaterThan(100);
});
