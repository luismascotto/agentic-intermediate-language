// MCP server (JSON-RPC 2.0 over newline-delimited stdio) for the agent
// plugins (Claude Code, Cursor, GitHub Copilot). Three tools: look at the spec (ail_show), build it (ail_build, the
// same build as the CLI), and check a running app against it (ail_adopt). No SDK dependency on purpose.
import { adopt, formatAdopt } from "./adopt.ts";
import { build } from "./build.ts";
import { getProvider, modelUnavailable, resolveModels } from "./providers/index.ts";
import { loadProject, type Project } from "./project.ts";
import { show } from "./show.ts";

type Json = Record<string, unknown>;
type ToolResult = { text: string; isError?: boolean };
interface Tool { name: string; description: string; inputSchema: Json; run: (p: Project, args: Json, progress: (message: string) => void) => ToolResult | Promise<ToolResult> }

const str = { type: "string" };
const obj = (properties: Json, required: string[] = []) => ({ type: "object", properties, required, additionalProperties: false });

export const TOOLS: Tool[] = [
  {
    name: "ail_show",
    description: 'Look at the AIL spec. target: "" for the tree with each node\'s build status, a node name for its source and who uses it, "stakeholder" | "design" | "engineer" | "specialist" (with optional tag) for an audience\'s view, or "changes" (optional since: git ref) for a review of what changed.',
    inputSchema: obj({ target: str, since: str }),
    run: (p, a) => ({ text: show(p, (a.target as string) ?? "", { since: a.since as string | undefined }) }),
  },
  {
    name: "ail_build",
    description: "Build the project, exactly like `ail build`: compile every node that changed (each with only its own slice of the spec, through the login of the agent's CLI (Claude Code, Cursor or Copilot) unless the project names other models), have a model compare each screen with its look, then check everything: the spec is sound, the code is built from it, and every check passes. With nothing to compile it only checks. Can take minutes. Reports STOP questions the spec must answer.",
    inputSchema: obj({ nodes: { type: "array", items: str }, force: { type: "boolean" } }),
    run: async (p, a, progress) => {
      const r = await build(p, { names: (a.nodes as string[]) ?? [], force: a.force === true, log: progress });
      return { text: r.text, isError: !r.ok };
    },
  },
  {
    name: "ail_adopt",
    description: "Does the app behave as the spec says? Starts the app as ail.config.json's `run` says (`app`: which entry; default run.legacy while adopting an existing app, else run.app), runs each flow's end-to-end check (checks/e2e/<folder>/<node>.e2e.ts, which drives the app however suits it: a browser, a simulator, a process) and stops it. Use it while bringing an existing app under AIL, to prove the spec describes it, and after building, to prove the new app behaves the same. Lists the flows that have no end-to-end check yet.",
    inputSchema: obj({ app: str, nodes: { type: "array", items: str } }),
    run: async (p, a, progress) => { const spec = resolveModels([], p.config.models)[0]!;
      const r = await adopt(p, { app: a.app as string | undefined, names: (a.nodes as string[]) ?? [], log: progress, suggestReview: true, record: true, judge: modelUnavailable(spec) ? undefined : getProvider(spec) }); return { text: formatAdopt(r), isError: !r.ok }; },
  },
];

export async function handle(msg: Json, root?: string, notify: (msg: Json) => void = () => {}): Promise<Json | null> {
  const id = msg.id as number | string | undefined;
  const method = msg.method as string;
  const reply = (result: Json) => ({ jsonrpc: "2.0", id, result });
  if (id === undefined) return null;
  switch (method) {
    case "initialize":
      return reply({
        protocolVersion: (msg.params as Json)?.protocolVersion ?? "2025-06-18",
        capabilities: { tools: {} },
        serverInfo: { name: "ail", version: "0.2.0" },
        instructions: "Tools for the Agentic Intermediate Language. The *.ail.md files are the source of truth; generated code is written only by ail_build.",
      });
    case "ping": return reply({});
    case "tools/list": return reply({ tools: TOOLS.map(({ run: _r, ...t }) => t) });
    case "tools/call": {
      const params = msg.params as { name: string; arguments?: Json; _meta?: { progressToken?: string | number } };
      const token = params._meta?.progressToken;
      let step = 0;
      const progress = (message: string) => { if (token !== undefined) notify({ jsonrpc: "2.0", method: "notifications/progress", params: { progressToken: token, progress: ++step, message } }); };
      const tool = TOOLS.find((t) => t.name === params.name);
      if (!tool) return { jsonrpc: "2.0", id, error: { code: -32602, message: `unknown tool ${params.name}` } };
      try {
        const r = await tool.run(loadProject(root), params.arguments ?? {}, progress);
        return reply({ content: [{ type: "text", text: r.text }], isError: r.isError ?? false });
      } catch (e) {
        return reply({ content: [{ type: "text", text: (e as Error).message }], isError: true });
      }
    }
    default:
      return { jsonrpc: "2.0", id, error: { code: -32601, message: `method not found: ${method}` } };
  }
}

export async function serve(root?: string) {
  const decoder = new TextDecoder();
  let buf = "";
  for await (const chunk of Bun.stdin.stream()) {
    buf += decoder.decode(chunk, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      let msg: Json;
      try { msg = JSON.parse(line); } catch { process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "parse error" } }) + "\n"); continue; }
      const out = await handle(msg, root, (n) => process.stdout.write(JSON.stringify(n) + "\n"));
      if (out) process.stdout.write(JSON.stringify(out) + "\n");
    }
  }
}

if (import.meta.main) await serve(process.argv[2]);
