import type { ReactNode } from "react";
import { Stack } from "../../parts/stack";
import { CodeBlock } from "../../parts/code-block";

/** props    number: integer, color: token name, depth: text, chip: text, reader: text, headline: text, explanation: text, lines: list of text, label: text, file: text, highlight: list of text, turnsInto: text, figure: a rendered view, last?: boolean, browse?: text */
export type JourneyStopProps = {
  number: number;
  color: string;
  depth: string;
  chip: string;
  reader: string;
  headline: string;
  explanation: string;
  lines: string[];
  label: string;
  file: string;
  highlight: string[];
  turnsInto: string;
  figure: ReactNode;
  last?: boolean;
  browse?: string;
};

function tokenVar(token: string): string {
  return `var(--${token.split(".").join("-")})`;
}

/** Every stop has the same anatomy, so the visitor compares levels instead of learning a new layout each time. */
export function JourneyStop({
  number,
  color,
  depth,
  chip,
  reader,
  headline,
  explanation,
  lines,
  label,
  file,
  highlight,
  turnsInto,
  figure,
  last,
  browse,
}: JourneyStopProps) {
  const stopColor = tokenVar(color);
  return (
    <article
      id={`stop-${number}`}
      style={{
        display: "grid",
        gridTemplateColumns: "clamp(32px, 9vw, 56px) minmax(0, 1fr)",
        columnGap: "clamp(12px, 3vw, 16px)",
        padding: "0 0 var(--space-12) 0",
        scrollMarginTop: "var(--space-4)",
      }}
    >
      <div style={{ gridColumn: 1, position: "relative" }}>
        <div
          aria-hidden="true"
          style={
            last
              ? {
                  position: "absolute",
                  left: "calc(clamp(32px, 9vw, 56px) / 2 - 2px)",
                  top: 0,
                  width: "4px",
                  height: "36px",
                  background: stopColor,
                }
              : {
                  position: "absolute",
                  left: "calc(clamp(32px, 9vw, 56px) / 2 - 2px)",
                  top: 0,
                  width: "4px",
                  bottom: 0,
                  background: stopColor,
                }
          }
        />
        <div
          aria-hidden="true"
          style={{
            position: "relative",
            marginLeft: "calc((clamp(32px, 9vw, 56px) - clamp(28px, 7vw, 36px)) / 2)",
            width: "clamp(28px, 7vw, 36px)",
            height: "clamp(28px, 7vw, 36px)",
            boxSizing: "border-box",
            borderRadius: "var(--radius-pill)",
            background: stopColor,
            border: "3px solid var(--color-surface)",
            boxShadow: `0 0 0 1px ${stopColor}`,
            color: "var(--color-on-accent)",
            fontSize: "clamp(var(--font-micro), 3vw, var(--font-small))",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {number}
        </div>
        <div
          className="ail-wide"
          style={{
            position: "relative",
            marginTop: "var(--space-2)",
            width: "56px",
            textAlign: "center",
            fontSize: "var(--font-micro)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--color-text-muted)",
            background: "var(--color-page)",
            padding: "var(--space-1) 0",
          }}
        >
          {depth}
        </div>
      </div>
      <Stack dir="v" gap="space.4" align="stretch" style={{ gridColumn: 2 }}>
        <Stack dir="h" gap="space.3" align="center" wrap={true}>
          <span
            style={{
              background: stopColor,
              color: "var(--color-on-accent)",
              fontSize: "var(--font-micro)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              borderRadius: "var(--radius-pill)",
              padding: "var(--space-1) var(--space-3)",
            }}
          >
            {chip}
          </span>
          <span
            style={{
              fontSize: "var(--font-small)",
              color: "var(--color-text-muted)",
            }}
          >
            {`Who reads this: ${reader}`}
          </span>
        </Stack>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--font-stop)",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            color: "var(--color-text)",
            margin: 0,
          }}
        >
          {headline}
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
            gap: "var(--space-6)",
            alignItems: "start",
          }}
        >
          <p
            style={{
              fontSize: "var(--font-body)",
              lineHeight: 1.6,
              color: "var(--color-text-muted)",
              maxWidth: "var(--width-prose)",
              margin: 0,
            }}
          >
            {explanation}
          </p>
          <div
            style={{
              background: "var(--color-surface-raised)",
              borderRadius: "var(--radius-lg)",
              padding: "clamp(12px, 2vw, 16px) clamp(4px, 2vw, 16px)",
              minHeight: "200px",
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {figure}
          </div>
        </div>
        <CodeBlock
          lines={lines}
          label={label}
          caption={file}
          highlight={highlight}
          edge={color}
        />
        {browse !== undefined ? (
          <a
            href={browse}
            style={{
              alignSelf: "flex-start",
              fontSize: "var(--font-small)",
              fontWeight: 600,
              color: "var(--color-accent)",
              textDecoration: "none",
            }}
          >
            Open the whole file in the spec browser ↓
          </a>
        ) : null}
        <p
          style={{
            maxWidth: "var(--width-prose)",
            background: "var(--color-accent-soft)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-2) var(--space-4)",
            fontSize: "var(--font-small)",
            lineHeight: 1.5,
            color: "var(--color-text)",
            margin: 0,
          }}
        >
          <span style={{ fontWeight: 700, color: "var(--color-accent)" }}>
            Turns into:
          </span>{" "}
          {turnsInto}
        </p>
      </Stack>
    </article>
  );
}
