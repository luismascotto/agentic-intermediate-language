import type { CSSProperties } from "react";

const sans: CSSProperties = { fontFamily: "var(--font-sans)" };
const mono: CSSProperties = { fontFamily: "var(--font-mono)" };

/** the node and the contracts it uses go into a compiler agent that sees one slice, and come out as a code file and its test */
export function BuildFigure() {
  return (
    <svg
      viewBox="0 0 360 256"
      role="img"
      aria-label="The ComputerPlayer node goes into a compiler agent and comes out as a 69-line file; a reviewer reads the 27-line node"
      style={{
        width: "100%",
        maxWidth: "360px",
        height: "auto",
        display: "block",
      }}
    >
      <rect
        x={4}
        y={20}
        width={104}
        height={64}
        rx={8}
        style={{ fill: "var(--color-surface)", stroke: "var(--color-border)" }}
      />
      <rect
        x={4}
        y={20}
        width={4}
        height={64}
        style={{ fill: "var(--color-level-specialist)" }}
      />
      <text
        x={16}
        y={44}
        fontSize={11}
        fontWeight={700}
        style={{ ...mono, fill: "var(--color-text)" }}
      >
        ComputerPlayer
      </text>
      <text
        x={16}
        y={60}
        fontSize={10}
        style={{ ...sans, fill: "var(--color-text-muted)" }}
      >
        + contracts of
      </text>
      <text
        x={16}
        y={74}
        fontSize={10}
        style={{ ...sans, fill: "var(--color-text-muted)" }}
      >
        GameState, Rules
      </text>
      <line
        x1={108}
        y1={52}
        x2={126}
        y2={52}
        strokeWidth={2}
        style={{ stroke: "var(--color-text-muted)" }}
      />
      <line
        x1={234}
        y1={52}
        x2={248}
        y2={52}
        strokeWidth={2}
        style={{ stroke: "var(--color-text-muted)" }}
      />
      <polygon
        points="128,52 144,14 216,14 232,52 216,90 144,90"
        style={{ fill: "var(--color-level-build)" }}
      />
      <text
        x={180}
        y={46}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        style={{ ...sans, fill: "var(--color-on-accent)" }}
      >
        compiler
      </text>
      <text
        x={180}
        y={61}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        style={{ ...sans, fill: "var(--color-on-accent)" }}
      >
        agent
      </text>
      <text
        x={180}
        y={78}
        textAnchor="middle"
        fontSize={11}
        opacity={0.85}
        style={{ ...sans, fill: "var(--color-on-accent)" }}
      >
        sees one slice
      </text>
      <rect
        x={256}
        y={24}
        width={100}
        height={50}
        rx={6}
        style={{ fill: "var(--color-code-border)" }}
      />
      <rect
        x={250}
        y={30}
        width={104}
        height={50}
        rx={6}
        style={{ fill: "var(--color-code)" }}
      />
      <text
        x={256}
        y={52}
        fontSize={10}
        style={{ ...mono, fill: "var(--color-code-text)" }}
      >
        computer-player.ts
      </text>
      <text
        x={256}
        y={68}
        fontSize={10}
        style={{ ...mono, fill: "var(--color-code-muted)" }}
      >
        + its derived test
      </text>
      <text
        x={4}
        y={124}
        fontSize={12}
        fontWeight={700}
        style={{ ...sans, fill: "var(--color-text)" }}
      >
        What a reviewer reads
      </text>
      <text
        x={4}
        y={148}
        fontSize={12}
        style={{ ...sans, fill: "var(--color-text-muted)" }}
      >
        the ComputerPlayer node
      </text>
      <rect
        x={4}
        y={154}
        width={138}
        height={14}
        rx={3}
        style={{ fill: "var(--color-level-specialist)" }}
      />
      <text
        x={148}
        y={165}
        fontSize={12}
        fontWeight={700}
        style={{ ...sans, fill: "var(--color-text)" }}
      >
        27 lines
      </text>
      <text
        x={4}
        y={192}
        fontSize={12}
        style={{ ...sans, fill: "var(--color-text-muted)" }}
      >
        the generated computer-player.ts
      </text>
      <rect
        x={4}
        y={198}
        width={352}
        height={14}
        rx={3}
        style={{ fill: "var(--color-code-muted)" }}
      />
      <text
        x={350}
        y={209}
        textAnchor="end"
        fontSize={12}
        fontWeight={700}
        style={{ ...sans, fill: "var(--color-on-accent)" }}
      >
        69 lines
      </text>
      <text
        x={4}
        y={244}
        fontSize={12}
        style={{ ...mono, fill: "var(--color-text-muted)" }}
      >
        ail.lock.json pins the file to its node&apos;s hash
      </text>
    </svg>
  );
}
