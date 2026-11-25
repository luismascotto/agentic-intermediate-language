import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { CompletionRequest, Provider } from "./index.ts";

// The Cursor and GitHub Copilot CLIs, with whatever they are logged in with
// (a Cursor or Copilot subscription). Like claude-code, every call runs in an
// empty folder, read-only, so no project file or AGENTS.md can leak into a
// node's encapsulated context. Neither CLI takes a system prompt, so it goes
// first in the prompt.

/** The first of these commands that is installed, or null. */
export function firstInstalled(names: string[], which: (cmd: string) => string | null = onPath): string | null {
  return names.find((n) => which(n)) ?? null;
}

/** Bun.which against the PATH as it is now. */
const onPath = (cmd: string) => Bun.which(cmd, { PATH: process.env.PATH ?? "" });

export const CURSOR_BINARIES = ["cursor-agent", "agent"];
export const COPILOT_BINARIES = ["copilot"];

function promptText(req: CompletionRequest, images: string[]): string {
  const shown = images.length
    ? `Look at these images, in the current folder, and use no other tool:\n${req.images!.map((im, i) => `- ${images[i]}: ${im.label}`).join("\n")}\n\n`
    : "Use no tools.\n\n";
  return `${req.system}\n\nAnswer with only the requested output, with no preamble or commentary. ${shown}---\n\n${req.prompt}`;
}

/** Linux refuses a single argument over 128 KiB; a longer prompt goes in a file next to the call. */
const MAX_ARG = 100_000;

/** The command line for one call; exported for tests. */
export function cliArgs(kind: "cursor" | "copilot", bin: string, model: string, images: string[]): string[] {
  if (kind === "cursor") return [bin, "-p", "--output-format", "text", "--mode", "ask", "--trust", ...(model ? ["--model", model] : [])];
  return [bin, "-s", "--no-color", "--stream=off", "--no-custom-instructions", "--no-ask-user", "--disable-builtin-mcps",
    ...images.flatMap((f) => ["--attachment", f]), ...(model ? [`--model=${model}`] : [])];
}

export function agentCliProvider(kind: "cursor" | "copilot", model: string, which: (cmd: string) => string | null = onPath): Provider {
  const names = kind === "cursor" ? CURSOR_BINARIES : COPILOT_BINARIES;
  const label = kind === "cursor" ? "the Cursor CLI (cursor-agent)" : "the GitHub Copilot CLI (copilot)";
  return {
    id: model ? `${kind}:${model}` : kind,
    async complete(req: CompletionRequest) {
      const bin = firstInstalled(names, which);
      if (!bin) throw new Error(`${label} is not installed`);
      const cwd = mkdtempSync(join(tmpdir(), `ail-${kind}-`));
      try {
        const images = (req.images ?? []).map((im, i) => {
          const name = `image-${i + 1}.png`;
          writeFileSync(join(cwd, name), Buffer.from(im.data, "base64"));
          return name;
        });
        const text = promptText(req, images);
        // Cursor takes the prompt as an argument; Copilot reads it from stdin.
        let arg = text;
        if (kind === "cursor" && Buffer.byteLength(text) > MAX_ARG) {
          writeFileSync(join(cwd, "prompt.md"), text);
          arg = "Read prompt.md in the current folder and do exactly what it says. Answer with only the requested output.";
        }
        const args = [...cliArgs(kind, which(bin) ?? bin, model, images), ...(kind === "cursor" ? [arg] : [])];
        const proc = Bun.spawn(args, { cwd, stdin: kind === "copilot" ? new TextEncoder().encode(text) : "ignore", stdout: "pipe", stderr: "pipe" });
        const [out, err, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
        if (code !== 0) throw new Error(`${bin} exited with ${code}: ${(err || out).trim().split("\n").slice(-3).join(" ")} (is ${label} installed and logged in?)`);
        return out;
      } finally {
        rmSync(cwd, { recursive: true, force: true });
      }
    },
  };
}
