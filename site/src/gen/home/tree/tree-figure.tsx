type Box = { name: string; x: number; y: number; width: number; height: number; fill: string; fontSize: number };

type Row = { name: string; x: number; parent: number; fill: string };

type Segment = [number, number, number, number];

const product = "var(--color-level-product)";
const experience = "var(--color-level-experience)";
const system = "var(--color-level-system)";
const specialist = "var(--color-level-specialist)";

const label = "The Tic-Tac-Toe spec as a tree: every node, with the path from TicTacToe through Engine down to ComputerPlayer highlighted";

const boxes: Box[] = [
  { name: "TicTacToe", x: 380, y: 10, width: 200, height: 44, fill: product, fontSize: 16 },
  { name: "App", x: 10, y: 100, width: 220, height: 44, fill: experience, fontSize: 15 },
  { name: "BoardKit", x: 250, y: 100, width: 220, height: 44, fill: experience, fontSize: 15 },
  { name: "Engine", x: 490, y: 100, width: 220, height: 44, fill: system, fontSize: 15 },
  { name: "UiKit", x: 730, y: 100, width: 220, height: 44, fill: experience, fontSize: 15 },
  { name: "PlayAGame", x: 42, y: 166, width: 188, height: 38, fill: experience, fontSize: 13 },
  { name: "NewGameButton", x: 74, y: 214, width: 156, height: 38, fill: experience, fontSize: 13 },
  { name: "ChooseOpponent", x: 74, y: 262, width: 156, height: 38, fill: experience, fontSize: 13 },
  { name: "WatchADemo", x: 42, y: 310, width: 188, height: 38, fill: experience, fontSize: 13 },
  { name: "BoardView", x: 282, y: 166, width: 188, height: 38, fill: experience, fontSize: 13 },
  { name: "StatusLine", x: 282, y: 214, width: 188, height: 38, fill: experience, fontSize: 13 },
  { name: "GameState", x: 522, y: 166, width: 188, height: 38, fill: system, fontSize: 13 },
  { name: "Rules", x: 522, y: 214, width: 188, height: 38, fill: system, fontSize: 13 },
  { name: "GameReducer", x: 522, y: 262, width: 188, height: 38, fill: system, fontSize: 13 },
  { name: "ComputerPlayer", x: 522, y: 310, width: 188, height: 38, fill: specialist, fontSize: 13 },
  { name: "Stack", x: 762, y: 166, width: 188, height: 38, fill: experience, fontSize: 13 },
  { name: "Text", x: 762, y: 214, width: 188, height: 38, fill: experience, fontSize: 13 },
  { name: "Button", x: 762, y: 262, width: 188, height: 38, fill: experience, fontSize: 13 },
  { name: "Segmented", x: 762, y: 310, width: 188, height: 38, fill: experience, fontSize: 13 },
];

const lines: Segment[] = [
  [480, 54, 120, 100],
  [480, 54, 360, 100],
  [480, 54, 840, 100],
  [26, 144, 26, 329],
  [26, 185, 42, 185],
  [26, 329, 42, 329],
  [58, 204, 58, 281],
  [58, 233, 74, 233],
  [58, 281, 74, 281],
  [266, 144, 266, 233],
  [266, 185, 282, 185],
  [266, 233, 282, 233],
  [506, 185, 522, 185],
  [506, 233, 522, 233],
  [506, 281, 522, 281],
  [746, 144, 746, 329],
  [746, 185, 762, 185],
  [746, 233, 762, 233],
  [746, 281, 762, 281],
  [746, 329, 762, 329],
];

const thread: Segment[] = [
  [480, 54, 600, 100],
  [506, 144, 506, 329],
  [506, 329, 522, 329],
];

const rows: Row[] = [
  { name: "TicTacToe", x: 4, parent: -1, fill: product },
  { name: "App", x: 28, parent: 0, fill: experience },
  { name: "PlayAGame", x: 52, parent: 1, fill: experience },
  { name: "NewGameButton", x: 76, parent: 2, fill: experience },
  { name: "ChooseOpponent", x: 76, parent: 2, fill: experience },
  { name: "WatchADemo", x: 52, parent: 1, fill: experience },
  { name: "BoardKit", x: 28, parent: 0, fill: experience },
  { name: "BoardView", x: 52, parent: 6, fill: experience },
  { name: "StatusLine", x: 52, parent: 6, fill: experience },
  { name: "Engine", x: 28, parent: 0, fill: system },
  { name: "GameState", x: 52, parent: 9, fill: system },
  { name: "Rules", x: 52, parent: 9, fill: system },
  { name: "GameReducer", x: 52, parent: 9, fill: system },
  { name: "ComputerPlayer", x: 52, parent: 9, fill: specialist },
  { name: "UiKit", x: 28, parent: 0, fill: experience },
  { name: "Stack", x: 52, parent: 14, fill: experience },
  { name: "Text", x: 52, parent: 14, fill: experience },
  { name: "Button", x: 52, parent: 14, fill: experience },
  { name: "Segmented", x: 52, parent: 14, fill: experience },
];

const threadRows = new Set<string>(["Engine", "ComputerPlayer"]);

const rowY = (i: number): number => 4 + 28 * i;

const outlineLines: Segment[] = rows.flatMap((row, i): Segment[] => {
  if (row.parent < 0 || threadRows.has(row.name)) {
    return [];
  }
  const parent = rows[row.parent];
  const px = parent.x + 10;
  const cy = rowY(i) + 11;
  return [
    [px, rowY(row.parent) + 22, px, cy],
    [px, cy, row.x, cy],
  ];
});

const outlineThread: Segment[] = [
  [14, 26, 14, 267],
  [14, 267, 28, 267],
  [38, 278, 38, 379],
  [38, 379, 52, 379],
];

const renderSegments = (segments: Segment[]) =>
  segments.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />);

const textStyle = {
  fontFamily: "var(--font-sans)",
  fontWeight: 700,
  fill: "var(--color-on-accent)",
};

/** "every node of the spec as a box colored by its level … below 600px viewport width the same tree is drawn as an indented outline" */
export function TreeFigure() {
  return (
    <>
      <svg
        className="ail-wide"
        role="img"
        aria-label={label}
        viewBox="0 0 960 360"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <g style={{ stroke: "var(--color-border)", strokeWidth: 2, fill: "none" }}>{renderSegments(lines)}</g>
        <g style={{ stroke: "var(--color-thread)", strokeWidth: 5, strokeLinecap: "round", fill: "none" }}>
          {renderSegments(thread)}
        </g>
        {boxes.map((box) => (
          <g key={box.name}>
            <rect x={box.x} y={box.y} width={box.width} height={box.height} rx={10} style={{ fill: box.fill }} />
            <text
              x={box.x + box.width / 2}
              y={box.y + (box.height === 44 ? 28 : 24)}
              textAnchor="middle"
              style={{ ...textStyle, fontSize: box.fontSize }}
            >
              {box.name}
            </text>
          </g>
        ))}
      </svg>
      <svg
        className="ail-narrow"
        role="img"
        aria-label={label}
        viewBox="0 0 300 534"
        style={{ width: "100%", maxWidth: "320px", height: "auto", margin: "0 auto" }}
      >
        <g style={{ stroke: "var(--color-border)", strokeWidth: 1.5, fill: "none" }}>{renderSegments(outlineLines)}</g>
        <g style={{ stroke: "var(--color-thread)", strokeWidth: 4, strokeLinecap: "round", fill: "none" }}>
          {renderSegments(outlineThread)}
        </g>
        {rows.map((row, i) => (
          <g key={row.name}>
            <rect x={row.x} y={rowY(i)} width={180} height={22} rx={6} style={{ fill: row.fill }} />
            <text
              x={row.x + 10}
              y={rowY(i) + 11}
              textAnchor="start"
              dominantBaseline="central"
              style={{ ...textStyle, fontSize: 13 }}
            >
              {row.name}
            </text>
          </g>
        ))}
      </svg>
    </>
  );
}
