// The VS Code extension's grammar, run through VS Code's own tokenizer
// (vscode-textmate with Oniguruma): every spec in this repository colors
// as AIL, inside Markdown as well as on its own.
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { INITIAL, Registry, parseRawGrammar, type IGrammar } from "vscode-textmate";
import { loadWASM, OnigScanner, OnigString } from "vscode-oniguruma";
import { loadProject } from "../src/project.ts";
import { KATA } from "./helpers.ts";

const ROOT = join(import.meta.dir, "..");
const EXT = join(ROOT, "editors/vscode");
const SITE = join(ROOT, "site");

await loadWASM(readFileSync(join(createRequire(import.meta.url).resolve("vscode-oniguruma"), "../onig.wasm")).buffer);

/** A stand-in for VS Code's Markdown grammar: AIL's injection targets its scope. */
const MARKDOWN = JSON.stringify({ scopeName: "text.html.markdown", patterns: [] });

const registry = new Registry({
  onigLib: Promise.resolve({ createOnigScanner: (s: string[]) => new OnigScanner(s), createOnigString: (s: string) => new OnigString(s) }),
  loadGrammar: async (scope) => {
    if (scope === "source.ail") return parseRawGrammar(readFileSync(join(EXT, "syntaxes/ail.tmLanguage.json"), "utf8"), "ail.tmLanguage.json");
    if (scope === "markdown.ail.codeblock") return parseRawGrammar(readFileSync(join(EXT, "syntaxes/ail.markdown.tmLanguage.json"), "utf8"), "ail.markdown.tmLanguage.json");
    if (scope === "text.html.markdown") return parseRawGrammar(MARKDOWN, "markdown.json");
    return null;
  },
  getInjections: (scope) => (scope === "text.html.markdown" ? ["markdown.ail.codeblock"] : undefined),
});
const ail = (await registry.loadGrammar("source.ail"))!;
const markdown = (await registry.loadGrammar("text.html.markdown"))!;

/** Each line's tokens as [text, scopes]. */
function tokenize(grammar: IGrammar, text: string): [string, string[]][][] {
  let state = INITIAL;
  return text.split("\n").map((line) => {
    const r = grammar.tokenizeLine(line, state);
    state = r.ruleStack;
    return r.tokens.map((t) => [line.slice(t.startIndex, t.endIndex), t.scopes] as [string, string[]]);
  });
}
const scopeOf = (lines: [string, string[]][][], line: number, text: string) =>
  lines[line]!.find(([t]) => t === text)?.[1].at(-1);

test("a node colors as AIL", () => {
  const lines = tokenize(ail, [
    `node GameState : data   level: system   @engine`,
    `  why   One shape for a game.   <- Engine`,
    `  what`,
    `    type Board    = list of Cell    ; always 9 cells`,
    `    boardFrom(text: text) -> Board`,
    `    Scenario: X always starts`,
    `      Given a new game`,
    `    examples`,
    `      boardFrom("X_O/___/__X") => ["X", nothing, "O"]`,
    `  how`,
    `    decide the computer answers after 300 ms`,
    `  look`,
    `    gap   space.4`,
    `    1. You can play.  refined-by: PlayAGame`,
  ].join("\n"));
  expect(scopeOf(lines, 0, "node")).toBe("keyword.control.statement.ail");
  expect(scopeOf(lines, 0, "GameState")).toBe("entity.name.type.node.ail");
  expect(scopeOf(lines, 0, "data")).toBe("storage.type.kind.ail");
  expect(scopeOf(lines, 0, "system")).toBe("constant.language.level.ail");
  expect(scopeOf(lines, 0, "@engine")).toBe("entity.other.attribute-name.tag.ail");
  expect(scopeOf(lines, 1, "why")).toBe("keyword.other.section.ail");
  expect(scopeOf(lines, 1, "Engine")).toBe("entity.name.type.reference.ail");
  expect(scopeOf(lines, 3, "type")).toBe("storage.type.ail");
  expect(scopeOf(lines, 3, "list of")).toBe("support.type.ail");
  expect(scopeOf(lines, 3, "; always 9 cells")).toBe("comment.line.semicolon.ail");
  expect(scopeOf(lines, 4, "boardFrom")).toBe("entity.name.function.ail");
  expect(scopeOf(lines, 4, "->")).toBe("keyword.operator.arrow.ail");
  expect(lines[4]!.filter(([t, sc]) => t === "text" && sc.includes("support.type.ail")).length).toBe(1); // the type, not the parameter
  expect(scopeOf(lines, 5, "Scenario")).toBe("keyword.control.scenario.ail");
  expect(scopeOf(lines, 6, "Given")).toBe("keyword.control.step.ail");
  expect(scopeOf(lines, 7, "examples")).toBe("keyword.other.label.ail");
  expect(scopeOf(lines, 8, "=>")).toBe("keyword.operator.arrow.ail");
  expect(scopeOf(lines, 8, "nothing")).toBe("constant.language.ail");
  expect(lines[8]!.some(([t, s]) => t === "X_O/___/__X" && s.includes("string.quoted.double.ail"))).toBe(true);
  expect(scopeOf(lines, 10, "decide")).toBe("keyword.other.decision.ail");
  expect(scopeOf(lines, 10, "300 ms")).toBe("constant.numeric.ail");
  expect(scopeOf(lines, 12, "space.4")).toBe("variable.other.token.ail");
  expect(scopeOf(lines, 13, "refined-by")).toBe("keyword.other.refined-by.ail");
});

test("a ; right after a word is text, as in AIL itself, and quoted text keeps its ;", () => {
  const [line] = tokenize(ail, `    copy   "a; b"  margin 0 auto; stack(v)`);
  expect(line!.some(([, s]) => s.includes("comment.line.semicolon.ail"))).toBe(false);
});

test("```ail blocks in Markdown color as AIL, and nothing outside them does", () => {
  const lines = tokenize(markdown, ["# GameState", "", "node is a word here.", "```ail", "node A : fn   level: system", "```", "node again"].join("\n"));
  expect(scopeOf(lines, 4, "node")).toBe("keyword.control.statement.ail");
  expect(lines[4]!.every(([, s]) => s.includes("meta.embedded.block.ail"))).toBe(true);
  expect(lines[2]!.flatMap(([, s]) => s)).not.toContain("keyword.control.statement.ail");
  expect(lines[6]!.flatMap(([, s]) => s)).not.toContain("keyword.control.statement.ail");
});

test("every section of every spec in this repository is colored as a section", () => {
  for (const dir of [KATA, SITE]) {
    const p = loadProject(dir);
    for (const n of p.ordered) {
      const text = readFileSync(join(p.root, n.file), "utf8");
      const lines = tokenize(markdown, text);
      const header = lines.findIndex((l) => l.map(([t]) => t).join("").startsWith(`node ${n.name} `) || l.map(([t]) => t).join("") === `node ${n.name}`);
      expect(header, `${n.name} in ${n.file}`).toBeGreaterThanOrEqual(0);
      expect(scopeOf(lines, header, n.name), n.name).toBe("entity.name.type.node.ail");
      for (const s of n.sections) {
        const at = lines.findIndex((l, i) => i > header && l.map(([t]) => t).join("") === s.raw[0]);
        expect(at, `${n.name}.${s.key}`).toBeGreaterThan(header);
        expect(scopeOf(lines, at, s.key), `${n.name}.${s.key}`).toMatch(/^keyword\.other\.section\.ail$/);
      }
    }
  }
});

test("the extension's manifest wires both grammars", () => {
  const pkg = JSON.parse(readFileSync(join(EXT, "package.json"), "utf8"));
  expect(pkg.contributes.grammars.map((g: { scopeName: string }) => g.scopeName)).toEqual(["source.ail", "markdown.ail.codeblock"]);
  expect(pkg.contributes.grammars[1].injectTo).toEqual(["text.html.markdown"]);
  expect(pkg.contributes.grammars[1].embeddedLanguages).toEqual({ "meta.embedded.block.ail": "ail" });
});
