# Play area

Two people on the same device take turns dropping chips.

```ail
node PlayAGame : flow   level: experience
  why   Make the game understandable without instructions.   <- App
  what
    Scenario: Red always starts
      Given a new game
      Then the status says "Red's turn"
    Scenario: taking turns
      Given a new game
      When Red drops in column 4
      Then the bottom cell of column 4 shows Red
      And the status says "Yellow's turn"
    Scenario: gravity stacks chips
      Given Red has already dropped in column 4
      When Yellow drops in column 4
      Then Yellow sits on top of Red in that column
      And the status says "Red's turn"
    Scenario: a full column can't be picked
      Given column 1 is full
      When the current player tries to drop in column 1
      Then nothing changes
    Scenario: winning
      Given Red has three chips stacked in column 1 and it is Red's turn
      When Red drops in column 1
      Then the status says "Red wins!"
      And those four cells are highlighted
      And no more columns can be picked
    Scenario: draw
      Given a game where the board fills up without four in a line
      When the last empty cell is filled
      Then the status says "It's a draw"
    Scenario: new game
      Given a finished game
      When the player presses "New game"
      Then every cell is empty and the status says "Red's turn"
  look
    layout       stack(v, gap: space.4, align: center) [ StatusLine, BoardView, NewGameButton ]
    width        fills its container
  binds
    state           game: Game, starting at initial(); "dispatch a" sets it to reduce(game, a)
    StatusLine      status = game.status, next = game.next
    BoardView       board = game.board, status = game.status, onDrop(c) = dispatch drop(c)
    NewGameButton   onPress() = dispatch newGame
  uses      StatusLine, BoardView, NewGameButton, GameState, GameReducer, Stack
  children  NewGameButton
```

```ail
node NewGameButton : view   level: experience
  why   Starting over must always be one press away.   <- PlayAGame
  what
    Scenario: pressing it
      When the player presses "New game"
      Then a new game is asked for, once
  look
    button   Button.secondary, width auto
  copy
    newgame.label  "New game"
  binds
    props    onPress()
  uses  Button
```
