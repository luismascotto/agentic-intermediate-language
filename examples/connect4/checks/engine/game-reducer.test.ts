import { describe, expect, test } from "bun:test";
import { initial } from "../../src/gen/engine/game-state";
import { play, reduce } from "../../src/gen/engine/game-reducer";

describe("GameReducer", () => {
  test("drop lands at the bottom of a column", () => {
    const game = play([3]);
    expect(game.board[38]).toBe("R");
    expect(game.next).toBe("Y");
  });

  test("gravity stacks chips in a column", () => {
    expect(play([3, 3]).board[31]).toBe("Y");
  });

  test("four vertical chips wins", () => {
    expect(play([0, 1, 0, 1, 0, 1, 0]).status).toEqual({
      kind: "won",
      mark: "R",
      line: [14, 21, 28, 35],
    });
  });

  test("a full column is ignored", () => {
    const g = play([3, 3, 3, 3, 3, 3]);
    expect(reduce(g, { type: "drop", column: 3 })).toBe(g);
  });

  test("newGame resets to initial", () => {
    expect(reduce(play([0]), { type: "newGame" })).toEqual(initial());
  });
});
