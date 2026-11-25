# Stop 5: specialist level

```ail
node StopSpecialist : view   level: experience
  why   Show the specialist level, where the promise is finally made true: an algorithm, an invariant and a stated way to prove it.   <- Journey
  what
    the fifth stop, in the specialist color
    Scenario: the specialist level
      Given the page is open
      Then the article "stop-5" has the level 3 heading "Specialist level: the promise becomes an algorithm and a proof."
      And the region named "Specialist-level spec excerpt" shows its fifteen lines, with "never loses" and the invariant highlighted
  look
    stop     JourneyStop with number 5, color color.level.specialist, figure SpecialistFigure, browse "#spec/tictactoe/engine/computer-player/computer-player.ail.md"
  copy
    specialist.depth     "depth 4"
    specialist.chip      "SPECIALIST"
    specialist.reader    "experts: here, someone who knows game search"
    specialist.headline  "Specialist level: the promise becomes an algorithm and a proof."
    specialist.body      "This is where “never loses” is made true. The node fixes the algorithm, the exact scoring, the tie-break and an invariant, and says how the promise will be checked. Rejected alternatives stay in the spec, so nobody argues them again."
    specialist.label     "Specialist-level spec excerpt"
    specialist.file      "examples/tictactoe/ail/engine/computer-player/computer-player.ail.md"
    specialist.line.1    "node ComputerPlayer : fn   level: specialist   @ai"
    specialist.line.2    "  why   Make "the computer never loses" true and provable, while still answering instantly.   <- Engine"
    specialist.line.3    "  what"
    specialist.line.4    "    choose(board: Board, me: Mark = "O") -> number    — precondition: the game on board is still playing"
    specialist.line.5    "    scoring, from me's point of view, where d counts the moves from board to the end of the game, this one included:"
    specialist.line.6    "      me wins → 10 − d;  me loses → d − 10;  draw → 0"
    specialist.line.7    "    tie-break: among equally scored moves, the lowest index"
    specialist.line.8    "    invariant: whatever the other player does, no game against choose ends in a win for the other player"
    specialist.line.9    "  how"
    specialist.line.10   "    decide full minimax over the remaining game tree, memoized by board"
    specialist.line.11   "      because there are at most 5,478 legal positions; exact search takes well under a millisecond and makes "never loses" provable"
    specialist.line.12   "      rejected hand-written heuristics (centre, corners, block, fork) because they are hard to prove correct and easy to get subtly wrong"
    specialist.line.13   "  verify"
    specialist.line.14   "    never loses: from the empty board, play every possible sequence of X moves against choose as O"
    specialist.line.15   "                 and assert that no game ends in a win for X"
    specialist.mark.1    "never loses"
    specialist.mark.2    "no game against choose ends in a win for the other player"
    specialist.turns     "A minimax search in TypeScript, and a check that plays every possible game against it."
  binds
    stop     JourneyStop with depth specialist.depth, chip specialist.chip, reader specialist.reader, headline specialist.headline, explanation specialist.body, lines specialist.line.1 to specialist.line.15, label specialist.label, file specialist.file, highlight [specialist.mark.1, specialist.mark.2], turnsInto specialist.turns
  uses      JourneyStop, SpecialistFigure
  children  SpecialistFigure
```

```ail
node SpecialistFigure : view   level: experience
  why   Show what "looking at every game" means: a tree of possible games in which X never wins.   <- StopSpecialist
  what
    a board at the top branching into three boards, each branching into three outcomes; every outcome is an O win or a draw, and the legend says X wins never
    Scenario: the picture
      Given the stop is shown
      Then an image named "A tree of possible games: every ending is an O win or a draw, never an X win" is shown
      And it contains the texts "O wins", "draw" and "X wins: never"
  look
    svg       viewBox 0 0 360 210, width 100%, max-width 360px, height auto, display block
    edges     drawn first, stroke color.level.specialist, stroke-width 1, opacity 0.5: from 130,44 to 46,80, 130,80 and 214,80; from each child's bottom center (46, 130 or 214; y 104) to its three leaves at x − 24, x and x + 24, y 145
    root      MiniBoard at x 112, y 8, cell 12, marks "X___O____"
    children  MiniBoard at x 34, 118 and 202, y 80, cell 8, with marks "X_X_O____", "XX__O____" and "X___O___X"
    leaves    circles r 5 at y 150 and x 22, 46, 70, 106, 130, 154, 190, 214, 238; fill color.pass for the 2nd, 4th and 8th, color.code.muted for the others
    legend    circles r 5 at cx 270, cy 40, 64 and 88, filled color.pass, color.code.muted and color.player.x; the third crossed by line 262,88 to 278,88, stroke color.text, stroke-width 1.5; texts at x 282, y 44, 68 and 92, font-size 12, fill color.text
    facts     mono text at 180, 196, text-anchor middle, font-size 12, fill color.text.muted
  copy
    specialist.figure.label  "A tree of possible games: every ending is an O win or a draw, never an X win"
    specialist.figure.owins  "O wins"
    specialist.figure.draw   "draw"
    specialist.figure.xwins  "X wins: never"
    specialist.figure.facts  "≤ 5,478 positions · memoized · every game checked"
  binds
    svg       role img with aria-label from specialist.figure.label
  uses  MiniBoard
```
