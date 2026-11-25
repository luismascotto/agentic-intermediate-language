import type { CSSProperties } from "react";
import { COLS, ROWS, type Board, type Cell, type Status } from "../engine/game-state";
import { Text } from "../ui/text";

type BoardViewProps = {
  board: Board;
  status: Status;
  onDrop: (column: number) => void;
};

const frameStyle: CSSProperties = {
  background: "var(--color-board)",
  borderRadius: "var(--radius-md)",
  padding: "var(--space-2)",
  width: "100%",
  display: "flex",
  gap: "var(--space-1)",
};

const columnStyleBase: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-1)",
  border: "none",
  background: "transparent",
  padding: 0,
};

function cellContent(cell: Cell): string {
  return cell === undefined || cell === null ? "empty" : cell;
}

function columnFull(board: Board, column: number): boolean {
  return board[column] === "R" || board[column] === "Y";
}

/** picking: pressing a column that still has room while the game is not over asks to drop in that column */
export function BoardView({ board, status, onDrop }: BoardViewProps) {
  const winningLine: number[] = status.kind === "won" ? status.line : [];
  const gameOver = status.kind !== "playing";
  return (
    <div role="grid" aria-label="Board" style={frameStyle}>
      {Array.from({ length: COLS }, (_, column) => {
        const pickable = !gameOver && !columnFull(board, column);
        return (
          <button
            key={column}
            type="button"
            aria-label={`Column ${column + 1}`}
            disabled={!pickable}
            style={{
              ...columnStyleBase,
              cursor: pickable ? "pointer" : "default",
            }}
            onClick={() => {
              if (pickable) {
                onDrop(column);
              }
            }}
          >
            {Array.from({ length: ROWS }, (_, row) => {
              const index = row * COLS + column;
              const cell = board[index] ?? null;
              const empty = cell === null;
              const style: CSSProperties = {
                aspectRatio: "1",
                borderRadius: "var(--radius-full)",
                background: winningLine.includes(index)
                  ? "var(--color-highlight)"
                  : "var(--color-surface)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              };
              return (
                <div
                  key={index}
                  role="gridcell"
                  aria-label={cellContent(cell)}
                  style={style}
                >
                  {empty ? null : (
                    <Text
                      variant="mark"
                      align="center"
                      color={cell === "R" ? "color.player.r" : "color.player.y"}
                    >
                      {cell}
                    </Text>
                  )}
                </div>
              );
            })}
          </button>
        );
      })}
    </div>
  );
}
