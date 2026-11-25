import { initial, landing, other } from "./game-state";
import type { Action, Game } from "./game-state";
import { evaluate } from "./rules";

/** reduce(game: Game, action: Action) -> Game — never mutates its input */
export function reduce(game: Game, action: Action): Game {
  switch (action.type) {
    case "drop": {
      if (game.status.kind !== "playing") {
        return game;
      }
      const index = landing(game.board, action.column);
      if (index === null) {
        return game;
      }
      const board = game.board.map((cell, i) => (i === index ? game.next : cell));
      const status = evaluate(board);
      return {
        board,
        next: status.kind === "playing" ? other(game.next) : game.next,
        status,
      };
    }
    case "newGame":
      return initial();
  }
}

/** play(columns: list of integer) -> Game — reduce drop(c) for each column in order, starting from initial() */
export function play(columns: number[]): Game {
  return columns.reduce<Game>(
    (game, column) => reduce(game, { type: "drop", column }),
    initial(),
  );
}
