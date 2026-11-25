// Agent hooks, for every agent the plugin runs in: Claude Code, Cursor and
// GitHub Copilot (the CLI and VS Code). Each sends its own payload on stdin
// and reads its own answer, so the decision (`preHook`, `postHook`) is made
// once and `respond` writes it in the agent's format.
//
// Payloads, by agent:
//   Claude Code  { hook_event_name, tool_name, tool_input: { file_path } }
//   Cursor       { cursor_version, workspace_roots, cwd, tool_name, tool_input }
//                or afterFileEdit's { file_path }
//   Copilot      { sessionId, cwd, toolName, toolArgs } (toolArgs may be a JSON string),
//                or the Claude-compatible { tool_name, tool_input }
import { existsSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { formatDiagnostics, lint } from "./lint.ts";
import { findRoot, loadProject } from "./project.ts";

export interface HookResult { code: 0 | 2; message: string }

export type Agent = "claude" | "cursor" | "copilot";
export const AGENTS: Agent[] = ["claude", "cursor", "copilot"];

type Payload = Record<string, unknown>;

function asObject(v: unknown): Payload {
  if (typeof v === "string") { try { v = JSON.parse(v); } catch { return {}; } }
  return v && typeof v === "object" ? v as Payload : {};
}

/** Which agent sent a payload, when the hook command doesn't say. */
export function agentOf(payload: unknown): Agent {
  const p = asObject(payload);
  if ("cursor_version" in p || "workspace_roots" in p) return "cursor";
  if ("toolName" in p || "toolArgs" in p || "sessionId" in p) return "copilot";
  return "claude";
}

/** The file a tool call writes, in any agent's payload. */
export function targetPath(payload: unknown): string | null {
  const p = asObject(payload);
  for (const input of [asObject(p.tool_input), asObject(p.toolArgs), p]) {
    for (const key of ["file_path", "notebook_path", "path", "filePath", "target_file"]) {
      const v = input[key];
      if (typeof v === "string" && v) return v;
    }
  }
  return null;
}

/** The folder a relative path in the payload is relative to. */
function baseOf(payload: unknown, cwd: string): string {
  const p = asObject(payload);
  if (typeof p.cwd === "string" && p.cwd) return p.cwd;
  const roots = p.workspace_roots;
  if (Array.isArray(roots) && typeof roots[0] === "string") return roots[0];
  return cwd;
}

/** The AIL project containing a file, or null when the file isn't in one (hooks then do nothing). */
function projectFor(file: string): string | null {
  const root = findRoot(dirname(file));
  return existsSync(join(root, "ail.config.json")) ? root : null;
}

export function generatedGlobs(root?: string): { root: string; globs: string[] } {
  const p = loadProject(root);
  const globs = (p.target?.settings["generated"] ?? "").split(/[\s,]+/).filter(Boolean);
  return { root: p.root, globs };
}

function absoluteTarget(payload: unknown, cwd: string): string | null {
  const file = targetPath(payload);
  if (!file) return null;
  return isAbsolute(file) ? file : resolve(baseOf(payload, cwd), file);
}

/** Before a tool runs: refuse direct edits to generated code. */
export function preHook(payload: unknown, cwd = process.cwd()): HookResult {
  const abs = absoluteTarget(payload, cwd);
  if (!abs) return { code: 0, message: "" };
  const project = projectFor(abs);
  if (!project) return { code: 0, message: "" };
  const { root, globs } = generatedGlobs(project);
  const rel = relative(root, abs);
  if (rel.startsWith("..")) return { code: 0, message: "" };
  const hit = globs.find((g) => new Bun.Glob(g).match(rel));
  if (!hit) return { code: 0, message: "" };
  return {
    code: 2,
    message: `${rel} is generated from the IL (matches "${hit}"). Do not edit it directly: change the .ail.md source and run \`ail build\` (or the plugin's build command, /ail:build in Claude Code).`,
  };
}

/** After a tool ran: lint when an .ail.md file changed, and report errors back. */
export function postHook(payload: unknown, cwd = process.cwd()): HookResult {
  const abs = absoluteTarget(payload, cwd);
  if (!abs || !abs.endsWith(".ail.md")) return { code: 0, message: "" };
  const project = projectFor(abs);
  if (!project) return { code: 0, message: "" };
  const p = loadProject(project);
  const errors = lint(p).filter((d) => d.severity === "error");
  if (!errors.length) return { code: 0, message: "" };
  return { code: 2, message: `the spec has problems after editing ${relative(project, abs)}:\n${formatDiagnostics(errors)}` };
}

export interface HookOutput { exit: number; stdout: string; stderr: string }

/**
 * A hook's answer, in the agent's own format.
 * - Claude Code reads exit code 2 and stderr, both before and after a tool.
 * - Cursor denies with { permission: "deny" }, and takes feedback after a
 *   tool as { additional_context }.
 * - Copilot denies with { permissionDecision: "deny", permissionDecisionReason },
 *   and takes feedback after a tool as { additionalContext }.
 * A refusal also exits 2, which every one of them reads as a denial.
 */
export function respond(kind: "pre" | "post", r: HookResult, agent: Agent): HookOutput {
  if (r.code === 0) return { exit: 0, stdout: "", stderr: "" };
  if (agent === "claude") return { exit: 2, stdout: "", stderr: r.message };
  if (kind === "pre") {
    const body = agent === "cursor"
      ? { permission: "deny", user_message: r.message, agent_message: r.message }
      : { permissionDecision: "deny", permissionDecisionReason: r.message };
    return { exit: 2, stdout: JSON.stringify(body), stderr: r.message };
  }
  const body = agent === "cursor" ? { additional_context: r.message } : { additionalContext: r.message };
  return { exit: 0, stdout: JSON.stringify(body), stderr: "" };
}
