import type { CSSProperties } from "react";

type WalkTerminalProps = {
  place: string;
  lines: string[];
  caret: boolean;
};

const rootStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  background: "var(--color-code)",
};

const headStyle: CSSProperties = {
  margin: 0,
  padding: "var(--space-2) var(--space-4)",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-tiny)",
  color: "var(--color-code-muted)",
  borderBottom: "1px solid var(--color-code-border)",
  overflowWrap: "anywhere",
};

const bodyStyle: CSSProperties = {
  flex: "1 1 auto",
  minHeight: "clamp(9em, 40vw, 320px)",
  boxSizing: "border-box",
  padding: "var(--space-3) var(--space-4)",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-code)",
  lineHeight: 1.5,
  color: "var(--color-code-text)",
};

const promptStyle: CSSProperties = {
  color: "var(--color-thread)",
  fontWeight: 700,
};

const caretStyle: CSSProperties = {
  display: "inline-block",
  width: "0.6em",
  height: "1.1em",
  marginLeft: "2px",
  verticalAlign: "text-bottom",
  background: "var(--color-thread)",
};

const emptyStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-sans)",
  fontSize: "var(--font-small)",
  fontStyle: "italic",
  color: "var(--color-code-muted)",
};

function lineColor(line: string): string {
  const mark = line.trimStart().charAt(0);
  if (mark === "✓") return "var(--color-dot-green)";
  if (mark === "✗") return "var(--color-dot-red)";
  if (mark === "!") return "var(--color-dot-amber)";
  if (mark === "?") return "var(--color-thread)";
  return "var(--color-code-text)";
}

/** a header naming where the commands run, then the given lines exactly, one per line, keeping every space; long lines wrap and are never cut off */
export function WalkTerminal({ place, lines, caret }: WalkTerminalProps) {
  return (
    <div style={rootStyle}>
      <p style={headStyle}>{place}</p>
      <div role="region" aria-label="Terminal output" style={bodyStyle}>
        {lines.length === 0 ? (
          <p style={emptyStyle}>Nothing is printed in this chapter.</p>
        ) : (
          lines.map((line, index) => {
            const hasPrompt = line.startsWith("$ ") || line.startsWith("> ");
            const isLast = index === lines.length - 1;
            return (
              <div
                key={index}
                style={{
                  margin: 0,
                  minHeight: "1.5em",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                  color: lineColor(line),
                }}
              >
                {hasPrompt ? (
                  <>
                    <span data-part="prompt" style={promptStyle}>
                      {line.slice(0, 2)}
                    </span>
                    {line.slice(2)}
                  </>
                ) : (
                  line
                )}
                {caret && isLast ? (
                  <span data-part="caret" aria-hidden="true" style={caretStyle} />
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
