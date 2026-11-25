import { MiniBoard } from "../../parts/mini-board";

const strata = [
  { y: 96, fill: "var(--color-level-product)", name: "Product", reader: "anyone" },
  { y: 154, fill: "var(--color-level-experience)", name: "Experience", reader: "design · QA" },
  { y: 212, fill: "var(--color-level-system)", name: "System", reader: "engineers" },
  { y: 270, fill: "var(--color-level-specialist)", name: "Specialist", reader: "experts" },
];

/** a picture of a speech bubble saying "Tic-Tac-Toe." and then "The computer never loses.", four colored layers named Product, Experience, System and Specialist, a block of code and a small game board, joined by one yellow line */
export function HeroFigure() {
  return (
    <svg
      viewBox="0 0 320 500"
      role="img"
      aria-label="One sentence sinks through four levels of spec and comes out as code and a game board"
      style={{
        width: "100%",
        maxWidth: "340px",
        height: "auto",
        display: "block",
        margin: "0 auto",
      }}
    >
      <rect
        x={20}
        y={10}
        width={280}
        height={72}
        rx={12}
        fill="var(--color-surface)"
        stroke="var(--color-border)"
        strokeWidth={1.5}
      />
      <path d="M44 80 L40 94 L68 80 Z" fill="var(--color-surface)" stroke="none" />
      <path
        d="M44 82 L40 94 L68 82"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={1.5}
      />
      <text
        x={160}
        y={34}
        textAnchor="middle"
        fontFamily="var(--font-sans)"
        fontSize={13}
        fontWeight={600}
        fill="var(--color-text-muted)"
      >
        Tic-Tac-Toe.
      </text>
      <text
        x={160}
        y={62}
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize={19}
        fontWeight={700}
        fill="var(--color-text)"
      >
        The computer never loses.
      </text>
      {strata.map((s) => (
        <rect key={s.name} x={40} y={s.y} width={240} height={52} rx={8} fill={s.fill} />
      ))}
      {strata.map((s) => (
        <text
          key={s.name}
          x={52}
          y={s.y + 31}
          fontFamily="var(--font-sans)"
          fontSize={13}
          fontWeight={600}
          fill="var(--color-on-accent)"
        >
          {s.name}
        </text>
      ))}
      {strata.map((s) => (
        <text
          key={s.name}
          x={268}
          y={s.y + 31}
          textAnchor="end"
          fontFamily="var(--font-sans)"
          fontSize={12}
          fill="var(--color-on-accent)"
          opacity={0.85}
        >
          {s.reader}
        </text>
      ))}
      <line
        x1={28}
        y1={104}
        x2={28}
        y2={312}
        stroke="var(--color-text-muted)"
        strokeWidth={1.5}
        fill="none"
      />
      <path
        d="M23 304 L28 314 L33 304"
        stroke="var(--color-text-muted)"
        strokeWidth={1.5}
        fill="none"
      />
      <text
        x={14}
        y={209}
        transform="rotate(-90 14 209)"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-sans)"
        fontSize={12}
        fill="var(--color-text-muted)"
      >
        more precise
      </text>
      <line
        x1={160}
        y1={82}
        x2={160}
        y2={406}
        stroke="var(--color-thread)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={400}
        style={{ animation: "ail-thread 2.4s ease-out 1 both" }}
      />
      <rect x={40} y={330} width={240} height={64} rx={8} fill="var(--color-code)" />
      <text
        x={54}
        y={352}
        fontFamily="var(--font-mono)"
        fontSize={12}
        fill="var(--color-code-text)"
      >
        export function choose(
      </text>
      <text
        x={66}
        y={368}
        fontFamily="var(--font-mono)"
        fontSize={12}
        fill="var(--color-code-text)"
      >
        {"board: Board, me: Mark = \"O\""}
      </text>
      <text
        x={54}
        y={384}
        fontFamily="var(--font-mono)"
        fontSize={12}
        fill="var(--color-code-text)"
      >
        {"): number {"}
      </text>
      <MiniBoard x={118} y={406} cell={28} marks="X___O____" />
    </svg>
  );
}
