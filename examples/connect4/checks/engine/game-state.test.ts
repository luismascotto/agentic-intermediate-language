import { describe, expect, test } from "bun:test";
import {
  boardFrom,
  initial,
  landing,
  other,
} from "../../src/gen/engine/game-state";

describe("GameState", () => {
  test("initial is empty with Red to move", () => {
    const game = initial();
    expect(game.board).toHaveLength(42);
    expect(game.board.every((cell) => cell === null)).toBe(true);
    expect(game.next).toBe("R");
    expect(game.status).toEqual({ kind: "playing" });
  });

  test("other flips marks", () => {
    expect(other("R")).toBe("Y");
    expect(other("Y")).toBe("R");
  });

  test("landing finds the lowest empty cell", () => {
    expect(landing(boardFrom("_______/_______/_______/_______/_______/_______"), 3)).toBe(38);
    expect(landing(boardFrom("_______/_______/_______/_______/_______/___R___"), 3)).toBe(31);
    expect(
      landing(boardFrom("___R___/___Y___/___R___/___Y___/___R___/___Y___"), 3),
    ).toBeNull();
  });
});
