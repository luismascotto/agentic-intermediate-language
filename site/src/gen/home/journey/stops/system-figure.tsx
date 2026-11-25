import { MiniBoard } from "../../../parts/mini-board";

const answers = [
  { y: 14, text: "won · X", fill: "var(--color-thread)", stroke: "var(--color-thread-strong)" },
  { y: 49, text: "draw", fill: "var(--color-surface)", stroke: "var(--color-border)" },
  { y: 84, text: "playing", fill: "var(--color-surface)", stroke: "var(--color-border)" },
];

/** a board with its top row of X marks highlighted and its empty squares numbered, an arrow into the rule, and three possible answers, the first of them lit */
export function SystemFigure() {
  return (
    <svg
      viewBox="0 0 360 164"
      role="img"
      aria-label="A board goes into the one rule and comes out as won, draw or playing"
      style={{ width: "100%", maxWidth: "360px", height: "auto", display: "block" }}
    >
      <MiniBoard x={8} y={20} cell={28} marks="XXXOO____" highlight={[0, 1, 2]} numbers={true} />
      <text
        x={8}
        y={124}
        fontSize={11}
        fill="var(--color-text-muted)"
        fontFamily="var(--font-sans)"
      >
        9 squares, row by row
      </text>
      <line x1={96} y1={62} x2={132} y2={62} stroke="var(--color-text-muted)" strokeWidth={2} />
      <path d="M126 57 L134 62 L126 67 Z" fill="var(--color-text-muted)" />
      <rect x={136} y={44} width={96} height={36} rx={8} fill="var(--color-level-system)" />
      <text
        x={184}
        y={67}
        textAnchor="middle"
        fontSize={13}
        fill="var(--color-on-accent)"
        fontFamily="var(--font-mono)"
      >
        evaluate
      </text>
      <line x1={232} y1={62} x2={268} y2={27} stroke="var(--color-text-muted)" strokeWidth={1.5} />
      <line x1={232} y1={62} x2={268} y2={62} stroke="var(--color-text-muted)" strokeWidth={1.5} />
      <line x1={232} y1={62} x2={268} y2={97} stroke="var(--color-text-muted)" strokeWidth={1.5} />
      {answers.map((answer) => (
        <g key={answer.text}>
          <rect
            x={268}
            y={answer.y}
            width={84}
            height={26}
            rx={13}
            fill={answer.fill}
            stroke={answer.stroke}
          />
          <text
            x={310}
            y={answer.y + 17}
            textAnchor="middle"
            fontSize={13}
            fill="var(--color-text)"
            fontFamily="var(--font-mono)"
          >
            {answer.text}
          </text>
        </g>
      ))}
      <path
        d="M136 120 V128 H232 V120"
        stroke="var(--color-text-muted)"
        strokeWidth={1.5}
        fill="none"
      />
      <text
        x={184}
        y={152}
        textAnchor="middle"
        fontSize={13}
        fill="var(--color-text-muted)"
        fontFamily="var(--font-sans)"
      >
        Engine: shared by play and watch
      </text>
    </svg>
  );
}
