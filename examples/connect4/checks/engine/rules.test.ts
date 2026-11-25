import { describe, expect, test } from "bun:test";
import { boardFrom } from "../../src/gen/engine/game-state";
import { LINES, evaluate } from "../../src/gen/engine/rules";

describe("Rules", () => {
  test("LINES has every length-4 window", () => {
    expect(LINES.length).toBe(69);
  });

  test("horizontal win on the bottom row", () => {
    expect(
      evaluate(boardFrom("_______/_______/_______/_______/_______/RRRR___")),
    ).toEqual({ kind: "won", mark: "R", line: [35, 36, 37, 38] });
  });

  test("vertical win", () => {
    expect(
      evaluate(boardFrom("R______/R______/R______/R______/_______/_______")),
    ).toEqual({ kind: "won", mark: "R", line: [0, 7, 14, 21] });
  });

  test("down-right diagonal win", () => {
    expect(
      evaluate(boardFrom("_______/_______/___R___/____R__/_____R_/______R")),
    ).toEqual({ kind: "won", mark: "R", line: [17, 25, 33, 41] });
  });

  test("down-left diagonal win", () => {
    expect(
      evaluate(boardFrom("_______/_______/______R/_____R_/____R__/___R___")),
    ).toEqual({ kind: "won", mark: "R", line: [20, 26, 32, 38] });
  });

  test("still playing", () => {
    expect(
      evaluate(boardFrom("_______/_______/_______/_______/_______/RRYYRRY")),
    ).toEqual({ kind: "playing" });
  });

  test("draw when the board is full", () => {
    expect(
      evaluate(boardFrom("RYRRYYY/YRRYYRR/RYYRRYR/YRRYYRY/RRYRYRY/YRYYRRY")),
    ).toEqual({ kind: "draw" });
  });

  test("tie-break prefers the first line in LINES order", () => {
    expect(
      evaluate(boardFrom("_______/_______/_______/_______/RRRR___/YYYY___")),
    ).toEqual({ kind: "won", mark: "R", line: [28, 29, 30, 31] });
  });
});
