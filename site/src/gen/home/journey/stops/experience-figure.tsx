import { MiniBoard } from "../../../parts/mini-board";

/** three small boards: empty, then X in the center, then an O answering in the top-left corner, with "300 ms" between the last two and the status line under them */
export function ExperienceFigure() {
  return (
    <svg
      viewBox="0 0 360 176"
      role="img"
      aria-label="Three frames: an empty board, X in the center, then O answers after 300 ms"
      style={{
        width: "100%",
        maxWidth: "360px",
        height: "auto",
        display: "block",
      }}
    >
      <MiniBoard x={6} y={10} cell={26} marks="_________" />
      <MiniBoard x={141} y={10} cell={26} marks="____X____" />
      <MiniBoard x={276} y={10} cell={26} marks="O___X____" />
      <line
        x1={90}
        y1={49}
        x2={133}
        y2={49}
        stroke="var(--color-text-muted)"
        strokeWidth={2}
      />
      <line
        x1={225}
        y1={49}
        x2={268}
        y2={49}
        stroke="var(--color-text-muted)"
        strokeWidth={2}
      />
      <path d="M127 44 L135 49 L127 54 Z" fill="var(--color-text-muted)" />
      <path d="M262 44 L270 49 L262 54 Z" fill="var(--color-text-muted)" />
      <circle
        cx={247}
        cy={26}
        r={8}
        fill="none"
        stroke="var(--color-text-muted)"
        strokeWidth={1.5}
      />
      <line
        x1={247}
        y1={26}
        x2={247}
        y2={21}
        stroke="var(--color-text-muted)"
        strokeWidth={1.5}
      />
      <line
        x1={247}
        y1={16}
        x2={247}
        y2={14}
        stroke="var(--color-text-muted)"
        strokeWidth={1.5}
      />
      <text
        x={247}
        y={72}
        textAnchor="middle"
        fontSize={12}
        fontFamily="var(--font-mono)"
        fill="var(--color-text)"
      >
        300 ms
      </text>
      <text
        x={45}
        y={106}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fontFamily="var(--font-sans)"
        fill="var(--color-text-muted)"
      >
        Given:
      </text>
      <text
        x={45}
        y={122}
        textAnchor="middle"
        fontSize={14}
        fontFamily="var(--font-sans)"
        fill="var(--color-text-muted)"
      >
        vs computer
      </text>
      <text
        x={180}
        y={106}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fontFamily="var(--font-sans)"
        fill="var(--color-text-muted)"
      >
        When:
      </text>
      <text
        x={180}
        y={122}
        textAnchor="middle"
        fontSize={14}
        fontFamily="var(--font-sans)"
        fill="var(--color-text-muted)"
      >
        X picks
      </text>
      <text
        x={315}
        y={106}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        fontFamily="var(--font-sans)"
        fill="var(--color-text-muted)"
      >
        Then:
      </text>
      <text
        x={315}
        y={122}
        textAnchor="middle"
        fontSize={14}
        fontFamily="var(--font-sans)"
        fill="var(--color-text-muted)"
      >
        O answers
      </text>
      <rect
        x={120}
        y={132}
        width={120}
        height={32}
        rx={16}
        fill="var(--color-surface)"
        stroke="var(--color-border)"
      />
      <text
        x={180}
        y={153}
        textAnchor="middle"
        fontSize={16}
        fontWeight={600}
        fontFamily="var(--font-sans)"
        fill="var(--color-text)"
      >
        <tspan fill="var(--color-player-x)">X</tspan>
        {"'s turn"}
      </text>
    </svg>
  );
}
