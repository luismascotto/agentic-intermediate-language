import { useReducer } from "react";
import { StatusLine } from "../../board/status-line";
import { BoardView } from "../../board/board-view";
import { NewGameButton } from "./new-game-button";
import { initial } from "../../engine/game-state";
import { reduce } from "../../engine/game-reducer";
import { Stack } from "../../ui/stack";

/** "Make the game understandable without instructions." */
export function PlayAGame() {
  const [game, dispatch] = useReducer(reduce, undefined, () => initial());
  return (
    <Stack dir="v" gap="space.4" align="center" style={{ width: "100%" }}>
      <StatusLine status={game.status} next={game.next} />
      <BoardView
        board={game.board}
        status={game.status}
        onDrop={(column: number) => dispatch({ type: "drop", column })}
      />
      <NewGameButton onPress={() => dispatch({ type: "newGame" })} />
    </Stack>
  );
}
