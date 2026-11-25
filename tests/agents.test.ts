// The plugin runs in Claude Code, Cursor and GitHub Copilot (CLI and VS Code):
// one MCP server, one skill, the same commands, and hooks that speak each
// agent's format.
import { expect, test } from "bun:test";
import { chmodSync, existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { agentOf, postHook, preHook, respond, targetPath } from "../src/hooks.ts";
import { cliArgs } from "../src/providers/agent-cli.ts";
import { defaultModel, getProvider, modelUnavailable } from "../src/providers/index.ts";
import { KATA } from "./helpers.ts";

const ROOT = join(import.meta.dir, "..");
const json = async (path: string) => JSON.parse(await Bun.file(join(ROOT, path)).text());
const GENERATED = join(KATA, "src/gen/engine/rules.ts");

const payloads = {
  claude: { hook_event_name: "PreToolUse", tool_name: "Edit", tool_input: { file_path: GENERATED } },
  cursor: { hook_event_name: "preToolUse", cursor_version: "2.6", workspace_roots: [KATA], tool_name: "Write", tool_input: { file_path: GENERATED } },
  copilot: { sessionId: "s", timestamp: 1, cwd: KATA, toolName: "edit", toolArgs: JSON.stringify({ path: "src/gen/engine/rules.ts" }) },
};

test("each agent's payload is recognised, and names the file it writes", () => {
  for (const [agent, p] of Object.entries(payloads)) {
    expect(agentOf(p)).toBe(agent as never);
    expect(targetPath(p)).toContain("rules.ts");
    expect(preHook(p, "/").code).toBe(2);
  }
  expect(targetPath({ file_path: "/x/a.ail.md", edits: [] })).toBe("/x/a.ail.md"); // Cursor's afterFileEdit
  expect(targetPath({ toolName: "edit", toolArgs: { path: "a.ts" } })).toBe("a.ts");
  expect(targetPath({ toolName: "bash", toolArgs: { command: "ls" } })).toBeNull();
  // A relative path is relative to the agent's cwd, not the hook's.
  expect(preHook({ cwd: KATA, toolName: "edit", toolArgs: { path: "index.html" } }, "/").code).toBe(0);
  expect(postHook({ cwd: KATA, toolName: "edit", toolArgs: { path: "ail/tictactoe.ail.md" } }, "/").code).toBe(0);
});

test("a refusal is written in each agent's own format, and exits 2", () => {
  const no = { code: 2 as const, message: "generated" };
  expect(respond("pre", no, "claude")).toEqual({ exit: 2, stdout: "", stderr: "generated" });
  expect(JSON.parse(respond("pre", no, "cursor").stdout)).toEqual({ permission: "deny", user_message: "generated", agent_message: "generated" });
  expect(respond("pre", no, "cursor").exit).toBe(2);
  expect(JSON.parse(respond("pre", no, "copilot").stdout)).toEqual({ permissionDecision: "deny", permissionDecisionReason: "generated" });
  expect(respond("pre", no, "copilot").exit).toBe(2);
  // After a tool, lint problems go back to the agent as context.
  expect(respond("post", no, "claude")).toEqual({ exit: 2, stdout: "", stderr: "generated" });
  expect(respond("post", no, "cursor")).toEqual({ exit: 0, stdout: JSON.stringify({ additional_context: "generated" }), stderr: "" });
  expect(respond("post", no, "copilot")).toEqual({ exit: 0, stdout: JSON.stringify({ additionalContext: "generated" }), stderr: "" });
  for (const agent of ["claude", "cursor", "copilot"] as const) expect(respond("pre", { code: 0, message: "" }, agent)).toEqual({ exit: 0, stdout: "", stderr: "" });
});

async function run(cmd: string[], stdin: unknown, cwd = ROOT, env: Record<string, string> = {}) {
  const proc = Bun.spawn(cmd, { cwd, stdin: new TextEncoder().encode(JSON.stringify(stdin)), stdout: "pipe", stderr: "pipe", env: { ...process.env, ...env } });
  const [stdout, stderr, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
  return { stdout, stderr, code };
}

test("Claude Code's hooks block an edit to generated code", async () => {
  const hooks = await json("hooks/hooks.json");
  const cmd = hooks.hooks.PreToolUse[0].hooks[0].command.replace("${CLAUDE_PLUGIN_ROOT}", ROOT);
  const r = await run(["sh", "-c", cmd], payloads.claude, KATA);
  expect(r.code).toBe(2);
  expect(r.stderr).toContain("is generated");
});

test("Cursor's hooks run from the plugin's folder and block an edit to generated code", async () => {
  const manifest = await json(".cursor-plugin/plugin.json");
  const hooks = await json(manifest.hooks);
  expect(hooks.hooks.preToolUse[0].matcher).toBe("Write");
  const r = await run(["sh", "-c", hooks.hooks.preToolUse[0].command], payloads.cursor);
  expect(r.code).toBe(2);
  expect(JSON.parse(r.stdout).permission).toBe("deny");
  const ok = await run(["sh", "-c", hooks.hooks.postToolUse[0].command], { ...payloads.cursor, tool_input: { file_path: join(KATA, "ail/tictactoe.ail.md") } });
  expect(ok).toMatchObject({ code: 0, stdout: "" });
});

test("Copilot's hooks find the plugin through PLUGIN_ROOT, and let everything through when it can't be found", async () => {
  const manifest = await json(".github/plugin/plugin.json");
  const hooks = await json(manifest.hooks);
  const pre = hooks.hooks.preToolUse[0];
  expect(new RegExp(`^(?:${pre.matcher})$`).test("edit")).toBe(true);
  expect(new RegExp(`^(?:${pre.matcher})$`).test("view")).toBe(false);
  const r = await run(["bash", "-c", pre.bash], payloads.copilot, KATA, { PLUGIN_ROOT: ROOT });
  expect(r.code).toBe(2);
  expect(JSON.parse(r.stdout).permissionDecision).toBe("deny");
  // Copilot denies on any failing hook, so a missing plugin folder must not block every edit.
  const lost = await run(["bash", "-c", pre.bash], payloads.copilot, mkdtempSync(join(tmpdir(), "ail-")), { PLUGIN_ROOT: "/nowhere" });
  expect(lost.code).toBe(0);
  expect(pre.powershell).toContain("hook pre --for copilot");
});

test("every agent gets the same MCP server, skill and commands, with no pinned version", async () => {
  const claude = await json(".claude-plugin/plugin.json");
  const cursor = await json(".cursor-plugin/plugin.json");
  const copilot = await json(".github/plugin/plugin.json");
  const roots = { claude: "${CLAUDE_PLUGIN_ROOT}", cursor: "${CURSOR_PLUGIN_ROOT}", copilot: "${PLUGIN_ROOT}" };
  for (const [agent, m] of Object.entries({ claude, cursor, copilot })) {
    expect(m.name).toBe("ail");
    expect(m.version).toBeUndefined();
    expect(m.mcpServers.ail).toEqual({ command: "bun", args: [`${roots[agent as keyof typeof roots]}/src/mcp.ts`], env: { AIL_HOST: agent } });
  }
  expect(existsSync(join(ROOT, cursor.logo))).toBe(true);
  for (const path of [copilot.skills, copilot.commands]) expect(existsSync(join(ROOT, path))).toBe(true);
  expect(existsSync(join(ROOT, "skills/ail/SKILL.md"))).toBe(true);
  const market = await json(".cursor-plugin/marketplace.json");
  expect(market.plugins).toEqual([expect.objectContaining({ name: "ail", source: "./" })]);
  expect(market.plugins[0].version).toBeUndefined();
});

test("without an API key, a build uses the login of the agent the plugin runs in", () => {
  const all = () => "/bin/x";
  expect(defaultModel({}, all)).toBe("claude-code");
  expect(defaultModel({ AIL_HOST: "cursor" }, all)).toBe("cursor");
  expect(defaultModel({ AIL_HOST: "copilot" }, all)).toBe("copilot");
  expect(defaultModel({ AIL_HOST: "copilot" }, (c) => (c === "cursor-agent" ? "/bin/cursor-agent" : null))).toBe("cursor");
  expect(defaultModel({ AIL_HOST: "cursor", ANTHROPIC_API_KEY: "k" }, all)).toBe("anthropic:claude-opus-5-5");
  expect(modelUnavailable("cursor", {}, () => null)).toContain("not installed");
  expect(modelUnavailable("copilot:gpt-5", {}, all)).toBeNull();
  expect(getProvider("cursor:sonnet-4").id).toBe("cursor:sonnet-4");
  expect(getProvider("copilot").id).toBe("copilot");
});

test("the Cursor and Copilot CLIs compile read-only, from an empty folder, with the system prompt first", async () => {
  expect(cliArgs("cursor", "cursor-agent", "m", [])).toEqual(["cursor-agent", "-p", "--output-format", "text", "--mode", "ask", "--trust", "--model", "m"]);
  expect(cliArgs("copilot", "copilot", "", ["image-1.png"])).toContain("--attachment");
  expect(cliArgs("copilot", "copilot", "", [])).not.toContain("--allow-all-tools");
  // A stand-in CLI that echoes what it was given.
  const bin = mkdtempSync(join(tmpdir(), "ail-bin-"));
  for (const name of ["cursor-agent", "copilot"]) {
    writeFileSync(join(bin, name), `#!/bin/sh\necho "cwd=$(ls -A | tr '\\n' ' ')"\necho "args=$*"\ncat\n`);
    chmodSync(join(bin, name), 0o755);
  }
  const PATH = process.env.PATH;
  process.env.PATH = `${bin}:${PATH}`;
  try {
    const req = { system: "SYSTEM", prompt: "PROMPT" };
    const cursor = await getProvider("cursor").complete(req);
    expect(cursor).toContain("cwd=\n");
    expect(cursor).toMatch(/args=-p .*SYSTEM.*PROMPT/s);
    const copilot = await getProvider("copilot").complete({ ...req, images: [{ label: "final screen", mediaType: "image/png", data: "iVBORw0KGgo=" }] });
    expect(copilot).toContain("cwd=image-1.png");
    expect(copilot).toContain("--attachment image-1.png");
    expect(copilot.indexOf("SYSTEM")).toBeLessThan(copilot.indexOf("PROMPT"));
    expect(copilot).toContain("image-1.png: final screen");
  } finally {
    process.env.PATH = PATH;
  }
});
