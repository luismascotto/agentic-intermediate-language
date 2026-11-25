/** ROWS: integer = 6 */
export const ROWS = 6;

/** COLS: integer = 7 */
export const COLS = 7;

/** type Mark = "R" | "Y" */
export type Mark = "R" | "Y";

/** type Cell = Mark | nothing */
export type Cell = Mark | null;

/** type Board = list of Cell — always 42 cells, row by row: index = row × 7 + column; row 0 is the top */
export type Board = Cell[];

/** type Status = { kind: "playing" } | { kind: "won", mark: Mark, line: list of integer } | { kind: "draw" } */
export type Status =
  | { kind: "playing" }
  | { kind: "won"; mark: Mark; line: number[] }
  | { kind: "draw" };

/** type Game = { board: Board, next: Mark, status: Status } */
export type Game = {
  board: Board;
  next: Mark;
  status: Status;
};

/** type Action = { type: "drop", column: integer } | { type: "newGame" } */
export type Action =
  | { type: "drop"; column: number }
  | { type: "newGame" };

/** initial() -> Game — empty board, R to move, playing */
export function initial(): Game {
  return {
    board: Array.from({ length: ROWS * COLS }, () => null),
    next: "R",
    status: { kind: "playing" },
  };
}

/** other(mark: Mark) -> Mark — the opposite mark */
export function other(mark: Mark): Mark {
  return mark === "R" ? "Y" : "R";
}

/** boardFrom(text: text) -> Board — "R", "Y" or "_" per cell, six rows of seven; "/" and spaces are ignored */
export function boardFrom(text: string): Board {
  return text
    .split("")
    .filter((char) => char !== "/" && char !== " ")
    .map((char): Cell => (char === "R" || char === "Y" ? char : null));
}

/** landing(board: Board, column: integer) -> integer or nothing — the index of the lowest empty cell in that column, or nothing if the column is full or column is outside 0–6 */
export function landing(board: Board, column: number): number | null {
  if (column < 0 || column >= COLS) {
    return null;
  }
  for (let row = ROWS - 1; row >= 0; row -= 1) {
    const index = row * COLS + column;
    if (board[index] === null || board[index] === undefined) {
      return index;
    }
  }
  return null;
}
