/** type NodeState = "fresh" | "stale" | "writing" | "compiling" | "contract" | "checking" | "rejected" | "stopped" | "skipped" | "unwritten" | "slice" | "written" | "adopted" | "proven" */
export type NodeState =
  | "fresh"
  | "stale"
  | "writing"
  | "compiling"
  | "contract"
  | "checking"
  | "rejected"
  | "stopped"
  | "skipped"
  | "unwritten"
  | "slice"
  | "written"
  | "adopted"
  | "proven";

/** type Inset = { kind: "card", label: text, lines: list of text } | { kind: "shot", node: text, test: text, label: text, verdict?: text } | { kind: "none" } */
export type Inset =
  | { kind: "card"; label: string; lines: string[] }
  | { kind: "shot"; node: string; test: string; label: string; verdict?: string }
  | { kind: "none" };

/** type Beat = { id: text, title: text, caption: text, seconds: integer, branch: boolean, lines: list of text, states: map of text to NodeState, inset: Inset } */
export type Beat = {
  id: string;
  title: string;
  caption: string;
  seconds: number;
  branch: boolean;
  lines: string[];
  states: Record<string, NodeState>;
  inset: Inset;
};

/** type Walkthrough = { command: text, place: text, picture: text, rest: NodeState, beats: list of Beat } */
export type Walkthrough = {
  command: string;
  place: string;
  picture: string;
  rest: NodeState;
  beats: Beat[];
};

const NODE_STATES: NodeState[] = [
  "fresh",
  "stale",
  "writing",
  "compiling",
  "contract",
  "checking",
  "rejected",
  "stopped",
  "skipped",
  "unwritten",
  "slice",
  "written",
  "adopted",
  "proven",
];

/** NODES are the 16 nodes of the Tic-Tac-Toe spec that ail build compiles, in drawing order */
export const NODES: string[] = [
  "TicTacToe",
  "App",
  "PlayAGame",
  "WatchADemo",
  "ChooseOpponent",
  "NewGameButton",
  "Stack",
  "Text",
  "Button",
  "Segmented",
  "BoardView",
  "StatusLine",
  "GameState",
  "Rules",
  "GameReducer",
  "ComputerPlayer",
];

/** totalSeconds(w: Walkthrough) -> integer — the sum of the seconds of all its beats */
export function totalSeconds(w: Walkthrough): number {
  return w.beats.reduce((sum, beat) => sum + beat.seconds, 0);
}

/** chapterStart(w: Walkthrough, chapter: integer) -> integer — the sum of the seconds of the beats before the one at index chapter */
export function chapterStart(w: Walkthrough, chapter: number): number {
  return w.beats.slice(0, chapter).reduce((sum, beat) => sum + beat.seconds, 0);
}

/** stateOf(w: Walkthrough, chapter: integer, node: text) -> NodeState — the state the beat at index chapter gives that node, or w.rest when its states leave the node out */
export function stateOf(w: Walkthrough, chapter: number, node: string): NodeState {
  return w.beats[chapter]?.states[node] ?? w.rest;
}

/** statesIn(w: Walkthrough) -> list of NodeState — every state that w.rest or any beat's states holds, each once, in the order NodeState lists them */
export function statesIn(w: Walkthrough): NodeState[] {
  const held = new Set<NodeState>([w.rest]);
  for (const beat of w.beats) {
    for (const state of Object.values(beat.states)) {
      held.add(state);
    }
  }
  return NODE_STATES.filter((state) => held.has(state));
}

/** linesShown(count: integer, seconds: integer, elapsed: integer) -> integer — 0 when count is 0; otherwise 1 plus the whole part of count × elapsed / (seconds × 1000), and never more than count */
export function linesShown(count: number, seconds: number, elapsed: number): number {
  if (count === 0) {
    return 0;
  }
  return Math.min(count, 1 + Math.floor((count * elapsed) / (seconds * 1000)));
}

/** clock(seconds: integer) -> text — the whole minutes, a colon, then the remaining seconds as two digits */
export function clock(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}
