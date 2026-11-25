# Engine

Shared game logic for Connect 4.

```ail
node Engine : library   level: system
  why   One set of rules for every part of the game, so the board and the status can never disagree.   <- Connect4
  children  GameState, Rules, GameReducer
```

```ail
node GameState : data   level: system
  why   One shape for a game, so every part agrees on it.   <- Engine
  what
    ROWS: integer = 6
    COLS: integer = 7
    type Mark   = "R" | "Y"
    type Cell   = Mark | nothing
    type Board  = list of Cell    — always 42 cells, row by row: index = row × 7 + column; row 0 is the top
    type Status = { kind: "playing" } | { kind: "won", mark: Mark, line: list of integer } | { kind: "draw" }
    type Game   = { board: Board, next: Mark, status: Status }
    type Action = { type: "drop", column: integer } | { type: "newGame" }
    initial() -> Game                              — empty board, R to move, playing
    other(mark: Mark) -> Mark                      — the opposite mark
    boardFrom(text: text) -> Board                 — "R", "Y" or "_" per cell, six rows of seven; "/" and spaces are ignored
    landing(board: Board, column: integer) -> integer or nothing
      — the index of the lowest empty cell in that column, or nothing if the column is full or column is outside 0–6
    examples
      initial() => { board: [nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing, nothing], next: "R", status: { kind: "playing" } }
      other("R") => "Y"
      other("Y") => "R"
      landing(boardFrom("_______/_______/_______/_______/_______/_______"), 3) => 38
      landing(boardFrom("_______/_______/_______/_______/_______/___R___"), 3) => 31
      landing(boardFrom("___R___/___Y___/___R___/___Y___/___R___/___Y___"), 3) => nothing
```

```ail
node GameReducer : fn   level: system
  why   Keep every rule of play in one place that can be tested without a screen.   <- Engine
  what
    reduce(game: Game, action: Action) -> Game        — never mutates its input
      drop(column)
        if status is playing and landing(board, column) is an index:
          that cell becomes next; status becomes evaluate(board);
          next becomes other(next) only if the status is still playing
        otherwise: return the same game object
      newGame → initial()
    play(columns: list of integer) -> Game
      — reduce drop(c) for each column in order, starting from initial()
    examples
      play([3]).board[38] => "R"
      play([3]).next => "Y"
      play([3, 3]).board[31] => "Y"
      play([0, 1, 0, 1, 0, 1, 0]).status => ({ kind: "won", mark: "R", line: [14, 21, 28, 35] })
      reduce(g, { type: "drop", column: 3 }) is g => true   where g = play([3, 3, 3, 3, 3, 3])
      reduce(play([0]), { type: "newGame" }) => initial()
  free  [ helper names ]
  uses  GameState, Rules
```

```ail
node Rules : fn   level: system
  why   The one definition of a win and a draw.   <- Engine
  what
    LINES: list of list of integer
      — every contiguous four cells: all horizontals (left to right, top to bottom),
        then all verticals (top to bottom, left to right),
        then diagonals that step down-right, then diagonals that step down-left
    evaluate(board: Board) -> Status
      the first line in LINES order whose four cells hold the same mark → won(mark, line)
      otherwise, if every cell is filled → draw
      otherwise → playing
    tie-break: when one move completes two lines, the winning line is the first in LINES order
    examples
      evaluate(boardFrom("_______/_______/_______/_______/_______/RRRR___")) => ({ kind: "won", mark: "R", line: [35, 36, 37, 38] })
      evaluate(boardFrom("R______/R______/R______/R______/_______/_______")) => ({ kind: "won", mark: "R", line: [0, 7, 14, 21] })
      evaluate(boardFrom("_______/_______/___R___/____R__/_____R_/______R")) => ({ kind: "won", mark: "R", line: [17, 25, 33, 41] })
      evaluate(boardFrom("_______/_______/______R/_____R_/____R__/___R___")) => ({ kind: "won", mark: "R", line: [20, 26, 32, 38] })
      evaluate(boardFrom("_______/_______/_______/_______/_______/RRYYRRY")) => ({ kind: "playing" })
      evaluate(boardFrom("RYRRYYY/YRRYYRR/RYYRRYR/YRRYYRY/RRYRYRY/YRYYRRY")) => ({ kind: "draw" })
      evaluate(boardFrom("_______/_______/_______/_______/RRRR___/YYYY___")) => ({ kind: "won", mark: "R", line: [28, 29, 30, 31] })
      LINES.length => 69
  free  [ how LINES is enumerated from ROWS, COLS and length 4 ]
  uses  GameState
```
