# Connect 4

A two-player drop game on a 6 × 7 board, specified as an AIL tree. Folders
mirror the tree; shared parts sit in `library` nodes.

```
connect4.ail.md                 product: Connect4
app/app.ail.md                  App → PlayAGame
app/play/play.ail.md            PlayAGame, NewGameButton
board/board.ail.md              BoardKit: BoardView, StatusLine
engine/engine.ail.md            Engine: GameState, Rules, GameReducer
ui/ui.ail.md                    UiKit: Stack, Text, Button
```

## Target

```ail
target
  code         TypeScript 5 in strict mode, ES modules, no `any`; React 19 function components only
  libs         react react-dom
  exports      named exports only; a view or flow exports a component named exactly like its node; export every name `what` mentions and nothing else except types
  props        named exactly as `binds` lists them
  state        a flow owns exactly the state `binds.state` names (useReducer for a reducer, useState for a single value); logic lives in fn modules; never mutate inputs
  effects      only flows use useEffect, and only for the timers `binds` names, cleared in the effect's cleanup
  styling      inline style objects; design tokens as CSS variables (token a.b.c → "var(--a-b-c)"); px only where `look` gives px
  layout       stack(v|h, gap: t, align: a, pad: t) [ A, B ] means the Stack node with those props and those children, in that order
  copy         user-visible text is the `copy` text verbatim, with {placeholders} filled in
  a11y         interactive elements are native buttons, or have a role and keyboard handling; accessible names come from `copy`
  comments     one JSDoc line per export quoting the clause it implements; no other comments
  formatting   2-space indent, double quotes, semicolons, trailing commas in multi-line literals
  entry        the system node compiles to an entry module that renders its `entry` node into the element with id "root"
  path.system  src/gen/main.tsx
  path.data    src/gen/{dir}/{kebab}.ts
  path.fn      src/gen/{dir}/{kebab}.ts
  path.view    src/gen/{dir}/{kebab}.tsx
  path.flow    src/gen/{dir}/{kebab}.tsx
  tokens-css   src/gen/tokens.css
  generated    src/gen/**
  tests        bun test with @testing-library/react and happy-dom
```

## Glossary

```ail
glossary
  term mark         plain "a Red or Yellow chip"                         formal Mark = "R" | "Y"
  term turn         plain "whose go it is"                               formal Game.next
  term column       plain "one of the seven vertical slots, left to right" formal column index 0–6
  term cell         plain "one place on the board"                       formal Board index 0–41, row by row; row 0 is the top
  term drop         plain "put a chip in a column so it falls to the lowest empty cell" formal Action type "drop"
  term line         plain "four cells in a row, column or diagonal"      formal an entry of Rules.LINES
  term win          plain "four of your chips in a line"                 formal status.kind = "won"
  term draw         plain "the board is full and nobody won"             formal status.kind = "draw"
  term "game over"  plain "someone won, or it's a draw"                  formal status.kind ≠ "playing"
```

## Design tokens

```ail
catalog
  tokens
    space.1=4px  space.2=8px  space.4=16px  space.6=24px  radius.md=8px  radius.full=9999px
    font.body=16px  font.status=18px  font.mark=28px
    color.surface=#ffffff  color.surface.raised=#f3f4f6  color.border=#d1d5db  color.board=#1d4ed8
    color.text=#111827  color.text.muted=#6b7280  color.action=#111827  color.action.text=#ffffff
    color.player.r=#dc2626  color.player.y=#eab308  color.highlight=#fde68a  color.focus=#2563eb
```

---

## Product

```ail
node Connect4 : system   level: product
  why   A classic two-player table game for the same device: drop chips, connect four, finish in a few minutes.
  what
    1. Two players take turns dropping their colour into columns on a 6 × 7 board.     refined-by: PlayAGame
    2. A chip falls to the lowest empty cell in the chosen column.                       refined-by: GameReducer
    3. Four of the same colour in a row, column or diagonal wins; a full board with
       no winner is a draw.                                                              refined-by: Rules
    4. You can start a new game at any time.                                             refined-by: NewGameButton
  entry     App
  children  App, BoardKit, Engine, UiKit
```
