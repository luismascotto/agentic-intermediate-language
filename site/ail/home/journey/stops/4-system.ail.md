# Stop 4: system level

```ail
node StopSystem : view   level: experience
  why   Show the system level: one exact shape for a board, one exact rule for a win, and examples that run as tests.   <- Journey
  what
    the fourth stop, in the system color
    Scenario: the system level
      Given the page is open
      Then the article "stop-4" has the level 3 heading "System level: one exact shape, one exact rule, examples that run."
      And the region named "System-level spec excerpt" shows its fifteen lines, with "ComputerPlayer" highlighted
  look
    stop     JourneyStop with number 4, color color.level.system, figure SystemFigure, browse "#spec/tictactoe/engine/engine.ail.md"
  copy
    system.depth     "depth 3"
    system.chip      "SYSTEM"
    system.reader    "engineers"
    system.headline  "System level: one exact shape, one exact rule, examples that run."
    system.body      "To prove anything about every game, the engine needs one exact board and one definition of a win. Prose gives way to types and examples, and every example line becomes a unit test, word for word. Playing and watching share this engine, so they can never disagree."
    system.label     "System-level spec excerpt"
    system.file      "examples/tictactoe/ail/engine/engine.ail.md"
    system.line.1    "node Engine : library   level: system"
    system.line.2    "  why   One set of rules for every part of the game, so playing and watching can never disagree.   <- TicTacToe"
    system.line.3    "  children  GameState, Rules, GameReducer, ComputerPlayer"
    system.line.4    "…"
    system.line.5    "node Rules : fn   level: system"
    system.line.6    "  …"
    system.line.7    "    evaluate(board: Board) -> Status"
    system.line.8    "      the first line in LINES order whose three cells hold the same mark → won(mark, line)"
    system.line.9    "      otherwise, if every cell is filled → draw"
    system.line.10   "      otherwise → playing"
    system.line.11   "    …"
    system.line.12   "    examples"
    system.line.13   "      evaluate(boardFrom("XXX/OO_/___")) => ({ kind: "won", mark: "X", line: [0, 1, 2] })"
    system.line.14   "      …"
    system.line.15   "      evaluate(boardFrom("XOX/XOO/OXX")) => ({ kind: "draw" })"
    system.mark      "ComputerPlayer"
    system.turns     "rules.ts, plus one unit test per example line. ComputerPlayer looks ahead with these same rules."
  binds
    stop     JourneyStop with depth system.depth, chip system.chip, reader system.reader, headline system.headline, explanation system.body, lines system.line.1 to system.line.15, label system.label, file system.file, highlight [system.mark], turnsInto system.turns
  uses      JourneyStop, SystemFigure
  children  SystemFigure
```

```ail
node SystemFigure : view   level: experience
  why   Show that a board is nine numbered squares and that one rule turns any board into exactly one of three answers.   <- StopSystem
  what
    a board with its top row of X marks highlighted and its empty squares numbered, an arrow into the rule, and three possible answers, the first of them lit
    Scenario: the picture
      Given the stop is shown
      Then an image named "A board goes into the one rule and comes out as won, draw or playing" is shown
      And it contains the texts "won · X", "draw" and "playing"
  look
    svg       viewBox 0 0 360 164, width 100%, max-width 360px, height auto, display block
    board     MiniBoard at x 8, y 20, cell 28, marks "XXXOO____", highlight 0, 1 and 2, numbers shown
    shape     text at 8, 124, font-size 11, fill color.text.muted
    into      line 96,62 to 132,62, stroke color.text.muted, stroke-width 2; head path "M126 57 L134 62 L126 67 Z", fill color.text.muted
    rule      rect x 136 y 44 width 96 height 36 rx 8, fill color.level.system; mono text at 184, 67, text-anchor middle, font-size 13, fill color.on.accent
    fan       lines from 232,62 to 268,27, to 268,62 and to 268,97, stroke color.text.muted, stroke-width 1.5
    answers   rects x 268 width 84 height 26 rx 13 at y 14, 49 and 84; mono texts at x 310, y + 17, text-anchor middle, font-size 13, fill color.text
    won       the first answer has fill color.thread and stroke color.thread.strong; the others fill color.surface and stroke color.border
    bracket   path "M136 120 V128 H232 V120", stroke color.text.muted, stroke-width 1.5, fill none; text at 184, 152, text-anchor middle, font-size 13, fill color.text.muted
  copy
    system.figure.label    "A board goes into the one rule and comes out as won, draw or playing"
    system.figure.shape    "9 squares, row by row"
    system.figure.rule     "evaluate"
    system.figure.won      "won · X"
    system.figure.draw     "draw"
    system.figure.playing  "playing"
    system.figure.shared   "Engine: shared by play and watch"
  binds
    svg       role img with aria-label from system.figure.label
  uses  MiniBoard
```
