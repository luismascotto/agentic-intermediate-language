# Walkthroughs as data

What a walkthrough is made of, so the player can show either one the same way.
The two walkthroughs themselves are in [`build.ail.md`](build.ail.md) and
[`adopt.ail.md`](adopt.ail.md). Their terminal lines are copied from the
output formats of the real tools.

```ail
node Walkthrough : data   level: system
  why   Both walkthroughs are told the same way, chapter by chapter, so they are data the player reads, never text written into the player.   <- WalkthroughPlayer
  what
    type NodeState = "fresh" | "stale" | "writing" | "compiling" | "contract" | "checking" | "rejected" | "stopped" | "skipped" | "unwritten" | "slice" | "written" | "adopted" | "proven"
    type Inset = { kind: "card", label: text, lines: list of text } | { kind: "shot", node: text, test: text, label: text, verdict?: text } | { kind: "none" }
    type Beat = { id: text, title: text, caption: text, seconds: integer, branch: boolean, lines: list of text, states: map of text to NodeState, inset: Inset }
    type Walkthrough = { command: text, place: text, picture: text, rest: NodeState, beats: list of Beat }
    NODES: list of text = ["TicTacToe", "App", "PlayAGame", "WatchADemo", "ChooseOpponent", "NewGameButton", "Stack", "Text", "Button", "Segmented", "BoardView", "StatusLine", "GameState", "Rules", "GameReducer", "ComputerPlayer"]
    NODES are the 16 nodes of the Tic-Tac-Toe spec that ail build compiles, in drawing order; its three libraries are not among them
    a beat is one chapter: its title, its caption, how many seconds it plays, whether it is a branch off the main path, the terminal lines it prints (verbatim; an empty text is an empty line), the state of the nodes it changes, and one inset
    a beat's states name only the nodes whose state differs from the walkthrough's rest state: a node its map leaves out is in the state rest, which is "fresh" for the build walkthrough and "unwritten" for the adopt walkthrough
    an inset of kind "card" is a small labelled card of text lines; one of kind "shot" is the committed screenshot of the given node at the end of the given test, with a label and, when the chapter judges the look, a verdict
    totalSeconds(w: Walkthrough) -> integer — the sum of the seconds of all its beats
    chapterStart(w: Walkthrough, chapter: integer) -> integer — the sum of the seconds of the beats before the one at index chapter
    stateOf(w: Walkthrough, chapter: integer, node: text) -> NodeState — the state the beat at index chapter gives that node, or w.rest when its states leave the node out
    statesIn(w: Walkthrough) -> list of NodeState — every state that w.rest or any beat's states holds, each once, in the order NodeState lists them
    linesShown(count: integer, seconds: integer, elapsed: integer) -> integer — how many of a beat's count lines show once elapsed milliseconds of its seconds have played: 0 when count is 0; otherwise 1 plus the whole part of count × elapsed / (seconds × 1000), and never more than count
    clock(seconds: integer) -> text — the whole minutes, a colon, then the remaining seconds as two digits
    examples
      clock(85) => "1:25"
      clock(0) => "0:00"
      clock(9) => "0:09"
      clock(600) => "10:00"
      linesShown(4, 10, 0) => 1
      linesShown(4, 10, 2500) => 2
      linesShown(4, 10, 9900) => 4
      linesShown(4, 10, 10000) => 4
      linesShown(0, 9, 4000) => 0
      NODES.length => 16
      totalSeconds({ command: "ail build", place: "terminal", picture: "tree", rest: "fresh", beats: [] }) => 0
  how
    decide elapsed is a whole number of milliseconds
      because the player's timer adds 100 ms at a time, and whole numbers keep every example exact
      rejected seconds with a fraction because sums of tenths drift and the line counts would then depend on rounding
```
