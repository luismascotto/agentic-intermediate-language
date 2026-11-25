import { COLS, ROWS, type Board, type Mark, type Status } from "./game-state";

function buildLines(): number[][] {
  const lines: number[][] = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col <= COLS - 4; col += 1) {
      lines.push([0, 1, 2, 3].map((i) => row * COLS + col + i));
    }
  }
  for (let col = 0; col < COLS; col += 1) {
    for (let row = 0; row <= ROWS - 4; row += 1) {
      lines.push([0, 1, 2, 3].map((i) => (row + i) * COLS + col));
    }
  }
  for (let row = 0; row <= ROWS - 4; row += 1) {
    for (let col = 0; col <= COLS - 4; col += 1) {
      lines.push([0, 1, 2, 3].map((i) => (row + i) * COLS + col + i));
    }
  }
  for (let row = 0; row <= ROWS - 4; row += 1) {
    for (let col = 3; col < COLS; col += 1) {
      lines.push([0, 1, 2, 3].map((i) => (row + i) * COLS + col - i));
    }
  }
  return lines;
}

/** LINES: list of list of integer — every contiguous four cells: horizontals, verticals, down-right diagonals, down-left diagonals */
export const LINES: number[][] = buildLines();

/** evaluate(board: Board) -> Status */
export function evaluate(board: Board): Status {
  for (const line of LINES) {
    const mark = board[line[0]!] as Mark | null | undefined;
    if (
      (mark === "R" || mark === "Y") &&
      line.every((index) => board[index] === mark)
    ) {
      return { kind: "won", mark, line: [...line] };
    }
  }
  if (board.every((cell) => cell === "R" || cell === "Y")) {
    return { kind: "draw" };
  }
  return { kind: "playing" };
}
