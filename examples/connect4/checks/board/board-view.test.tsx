// ail-derived-from: BoardView@seed
import { afterEach, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BoardView } from "../../src/gen/board/board-view";
import { boardFrom } from "../../src/gen/engine/game-state";
import type { Status } from "../../src/gen/engine/game-state";

afterEach(() => {
  cleanup();
});

const emptyBoard = "_______/_______/_______/_______/_______/_______";
const fullCol0 =
  "R______/Y______/R______/Y______/R______/Y______";

test("dropping in an empty column", () => {
  const onDrop = mock((_column: number) => {});
  const status: Status = { kind: "playing" };
  render(
    <BoardView board={boardFrom(emptyBoard)} status={status} onDrop={onDrop} />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Column 4" }));

  expect(onDrop).toHaveBeenCalledTimes(1);
  expect(onDrop).toHaveBeenCalledWith(3);
});

test("a full column does nothing", () => {
  const onDrop = mock((_column: number) => {});
  const status: Status = { kind: "playing" };
  render(
    <BoardView board={boardFrom(fullCol0)} status={status} onDrop={onDrop} />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Column 1" }));

  expect(onDrop).not.toHaveBeenCalled();
});

test("the winning line stands out", () => {
  const onDrop = mock((_column: number) => {});
  const status: Status = { kind: "won", mark: "R", line: [35, 36, 37, 38] };
  render(
    <BoardView
      board={boardFrom("_______/_______/_______/_______/_______/RRRR___")}
      status={status}
      onDrop={onDrop}
    />,
  );

  const cells = screen.getAllByRole("gridcell");
  const highlighted = cells
    .map((cell, index) =>
      (cell.getAttribute("style") ?? "").includes("var(--color-highlight)")
        ? index
        : -1,
    )
    .filter((index) => index >= 0);
  // cells are column-major in the DOM (col0 rows 0..5, then col1, …)
  // indices 35..38 are row5 cols 0..3 → DOM positions 5, 11, 17, 23
  expect(highlighted).toEqual([5, 11, 17, 23]);

  for (const button of screen.getAllByRole("button", { name: /^Column / })) {
    expect((button as HTMLButtonElement).disabled).toBe(true);
  }
  expect(onDrop).not.toHaveBeenCalled();
});
