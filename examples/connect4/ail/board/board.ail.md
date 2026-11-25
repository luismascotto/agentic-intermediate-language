# Board kit

Shared board UI for Connect 4.

```ail
node BoardKit : library   level: experience
  why   The board and the status line look and behave the same everywhere they appear.   <- Connect4
  children  BoardView, StatusLine
```

```ail
node BoardView : view   level: experience
  why   The board is the whole game; it must be obvious which columns can take a chip.   <- BoardKit
  what
    shows      6 rows of 7 cells; each cell is empty, Red or Yellow
    picking    pressing a column that still has room while the game is not over asks to drop in that column
    otherwise  a full column or a finished game can't be picked and gives no feedback
    keyboard   the seven columns are reached with Tab left to right; Enter or Space drops in the focused column
    naming     the board is a grid named with board.label; each column control is a button named with column.label
               columns count from 1; an empty cell's content is the word from cell.empty
    Scenario: dropping in an empty column
      Given an empty board while playing
      When the player presses column 4
      Then the board asks to drop in column 3
    Scenario: a full column does nothing
      Given column 1 is full
      When the player presses column 1
      Then nothing is asked
    Scenario: the winning line stands out
      Given Red has won with four cells in a line
      Then exactly those four cells are highlighted
      And no column can be picked
  look
    frame         background color.board, radius.md, pad space.2, fills the width of its container
    grid          6 × 7 cells, gap space.1
    cell          circle (aspect ratio 1, radius.full), background color.surface; empty cells stay surface
    chip          Text.mark centered; R in color.player.r, Y in color.player.y
    winning line  its four cells get background color.highlight behind the chip
    columns       each column is one native button covering that column's six cells
    cursor        a pointer only on columns that can take a drop
  copy
    board.label    "Board"
    column.label   "Column {column}"
    cell.empty     "empty"
  binds
    props    board: Board, status: Status, onDrop(column: number)
    column   a native button, disabled when it can't be picked
  free  [ internal component split ]
  uses  GameState, Text
```

```ail
node StatusLine : view   level: experience
  why   Always tell the players what is going on.   <- BoardKit
  what
    shows exactly one message: whose turn it is, who won, or that it's a draw
    mark "R" is shown as the word Red; mark "Y" as the word Yellow
    the colour word in the message appears in that player's color
    changes are announced to screen readers
    Scenario: whose turn
      Given it is Yellow's turn
      Then the status reads "Yellow's turn"
    Scenario: a win
      Given Red has won
      Then the status reads "Red wins!"
    Scenario: a draw
      Given the game is a draw
      Then the status reads "It's a draw"
  look
    text     Text.status, centered, announced politely
    player   the {player} part in color.player.r or color.player.y
  copy
    status.turn  "{player}'s turn"
    status.win   "{player} wins!"
    status.draw  "It's a draw"
    player.R     "Red"
    player.Y     "Yellow"
  binds
    props    status: Status, next: Mark
  uses  GameState, Text
```
