import type { Walkthrough } from "./walkthrough";
import { BUILD_FIRST_HALF } from "./build-first-half";
import { BUILD_SECOND_HALF } from "./build-second-half";

/** BUILD: Walkthrough = { command: "ail build", place: "terminal · examples/tictactoe", picture: "Tic-Tac-Toe spec · 16 nodes", rest: "fresh", beats: the five beats of BUILD_FIRST_HALF, then the five of BUILD_SECOND_HALF, in their order } */
export const BUILD: Walkthrough = {
  command: "ail build",
  place: "terminal · examples/tictactoe",
  picture: "Tic-Tac-Toe spec · 16 nodes",
  rest: "fresh",
  beats: [...BUILD_FIRST_HALF, ...BUILD_SECOND_HALF],
};
