import type { Walkthrough } from "./walkthrough";
import { ADOPT_FIRST_HALF } from "./adopt-first-half";
import { ADOPT_SECOND_HALF } from "./adopt-second-half";

/** ADOPT: Walkthrough = { command: "/ail:adopt ../legacy-tictactoe \"the play screen\"", place: "Claude Code · tictactoe-ail/", picture: "tictactoe-ail/ spec, written node by node", rest: "unwritten", beats: the five beats of ADOPT_FIRST_HALF, then the five of ADOPT_SECOND_HALF, in their order } */
export const ADOPT: Walkthrough = {
  command: "/ail:adopt ../legacy-tictactoe \"the play screen\"",
  place: "Claude Code · tictactoe-ail/",
  picture: "tictactoe-ail/ spec, written node by node",
  rest: "unwritten",
  beats: [...ADOPT_FIRST_HALF, ...ADOPT_SECOND_HALF],
};
