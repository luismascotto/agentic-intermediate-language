# A tree of tasks

Why the spec is a tree, and why that matters for building it: every node is
the same kind of task, and each is compiled on its own. The idea comes from
Recursive Language Models (Zhang, Kraska and Khattab, MIT CSAIL).

```ail
node TreeSection : view   level: experience
  why   Make plain that a spec is one recursive shape: a tree of tasks that are all alike, built one node at a time.   <- HomePage
  what
    the section has the id "tree", so the page can link to it
    a heading, the real Tic-Tac-Toe spec drawn as a tree with every node, three points on what the tree shape gives, and where the idea comes from, with a link to the paper
    Scenario: the tree is explained
      Given the page is open
      Then the section with the id "tree" has the level 2 heading "A tree of tasks, the same all the way down"
      And it has the level 3 headings "One shape at every level", "Built one node at a time" and "Checked node by node", in that order
      And the link "Read the paper (arXiv:2512.24601) ↗" leads to "https://arxiv.org/abs/2512.24601"
  look
    band      Section with id "tree", tone plain
    head      SectionHeading with eyebrow from tree.eyebrow, text from tree.heading, lead from tree.lead
    figure    a div: background color.surface.raised, radius.lg, pad clamp(16px, 4vw, 24px), overflow hidden; holding TreeFigure
    points    a div: display grid, grid-template-columns repeat(auto-fit, minmax(min(260px, 100%), 1fr)), gap space.4
    point     a div: background color.surface, a 1px solid color.border border, radius.lg, pad clamp(16px, 4vw, 24px); stack(v, gap: space.2, align: start) [ title, text ]
    title     an h3: font.lead, weight 700, color.text, margin 0
    text      a p: font.body, line-height 1.6, color.text.muted, margin 0
    cite      a div: background color.code, color color.code.text, radius.lg, pad clamp(16px, 4vw, 24px); stack(v, gap: space.2, align: start) [ cite.eyebrow, cite.title, cite.text, cite.link ]
    cite.eyebrow  a p: font.tiny, weight 700, letter-spacing 0.12em, color color.dot.amber, margin 0
    cite.title    an h3: font.display at 22px, weight 700, color color.code.text, margin 0
    cite.text     a p: font.body, line-height 1.6, color color.code.muted, max-width width.prose, margin 0
    cite.link     a link: display inline-flex, align-items center, min-height 44px, font.small, weight 700, color color.thread, no underline
    layout    stack(v, gap: space.6, align: stretch) [ head, figure, points, cite ]
  copy
    tree.eyebrow      "RECURSIVE BY DESIGN"
    tree.heading      "A tree of tasks, the same all the way down"
    tree.lead         "Every node is a task that answers the same three questions: why it exists, what it does, and how. A node too big to answer at once hands parts to its children, which answer the same questions one level more precisely."
    tree.1.title      "One shape at every level"
    tree.1.text       "The root states the product's promises. Its children refine them into screens and rules, and theirs into algorithms. Every node, at every depth, has the same why, what and how."
    tree.2.title      "Built one node at a time"
    tree.2.text       "ail build compiles each node with a fresh call that sees only that node, its why chain and the contracts of the nodes it uses. ComputerPlayer is built from its own 27-line node, not from the whole spec."
    tree.3.title      "Checked node by node"
    tree.3.text       "Each node's examples and scenarios run as tests against its own code, so every branch is checked on its own, and together they keep the promise at the top."
    tree.cite.eyebrow "WHERE THE IDEA COMES FROM"
    tree.cite.title   "Inspired by Recursive Language Models"
    tree.cite.text    "Alex L. Zhang, Tim Kraska and Omar Khattab at MIT CSAIL let a model keep a long prompt outside itself and call itself, recursively, on just the parts it needs. AIL applies the same idea to building software: the spec is the environment, and each node is compiled by a fresh call that sees only its part."
    tree.cite.link    "Read the paper (arXiv:2512.24601) ↗"
  binds
    cite.link  a link to "https://arxiv.org/abs/2512.24601"
  uses      Section, SectionHeading, Stack, TreeFigure
  children  TreeFigure
```

```ail
node TreeFigure : view   level: experience
  why   Show the tree itself: every node of the Tic-Tac-Toe spec, and the path the page follows down to the computer player.   <- TreeSection
  what
    every node of the spec as a box colored by its level: the root on top, its four children in a row under it, and under each of those its own children stacked in a column; the two children of PlayAGame sit one step further in, under PlayAGame
    lines join each node to its parent; the path from the root through Engine to ComputerPlayer is drawn as the yellow thread
    below 600px viewport width the same tree is drawn as an indented outline, one node per row, so every name stays readable on a phone
    Scenario: the picture
      Given the section is shown
      Then an image named "The Tic-Tac-Toe spec as a tree: every node, with the path from TicTacToe through Engine down to ComputerPlayer highlighted" is shown
      And it contains the texts "TicTacToe", "App", "PlayAGame", "NewGameButton", "ChooseOpponent", "WatchADemo", "BoardKit", "BoardView", "StatusLine", "Engine", "GameState", "Rules", "GameReducer", "ComputerPlayer", "UiKit", "Stack", "Text", "Button" and "Segmented"
  look
    svg       class "ail-wide" (shown only at 600px viewport width or more); viewBox 0 0 960 360, width 100%, height auto, display block
    lines     drawn first, stroke color.border, stroke-width 2, fill none
    thread    drawn over the lines, stroke color.thread, stroke-width 5, stroke-linecap round, fill none
    box       a rect with rx 10; its name centered in it (text-anchor middle, at the box's center x and its y + 24 for a 38 high box, + 28 for a 44 high one), weight 700, fill color.on.accent
    root      box x 380 y 10 width 200 height 44, fill color.level.product, font-size 16: TicTacToe
    columns   four boxes y 100 width 220 height 44, font-size 15: x 10 App, x 250 BoardKit and x 730 UiKit, fill color.level.experience; x 490 Engine, fill color.level.system
    to.columns  lines from 480,54 to 120,100; to 360,100; to 600,100; and to 840,100 (that last one to Engine is the thread instead: 480,54 to 600,100)
    rows      children are boxes of height 38, font-size 13, at y 166, 214, 262, 310 for the first to fourth child in a column
    spine     each column has a line from its spine x, 144 down to the center y (box y + 19) of its last child, and from the spine x to each child's left edge at that child's center y; the spine x is the column's x + 16, and children start at the column's x + 32 with width 188
    app       under App: PlayAGame at y 166, WatchADemo at y 310, fill color.level.experience; App's spine reaches PlayAGame and WatchADemo only
    play      under PlayAGame, one step in: NewGameButton at y 214 and ChooseOpponent at y 262, at x 74 width 156, fill color.level.experience; their own spine at x 58, from 204 down to 281, with lines from 58 to 74 at each child's center y
    board     under BoardKit: BoardView at y 166 and StatusLine at y 214, fill color.level.experience
    engine    under Engine: GameState, Rules and GameReducer at y 166, 214 and 262, fill color.level.system; ComputerPlayer at y 310, fill color.level.specialist; Engine's spine and the line to ComputerPlayer are the thread instead
    ui        under UiKit: boxes named "Stack", "Text", "Button" and "Segmented" at y 166, 214, 262 and 310, fill color.level.experience
    outline   a second svg with class "ail-narrow" (shown only below 600px viewport width): viewBox 0 0 300 534, width 100%, max-width 320px, height auto, margin 0 auto. It has 19 rows in this order: TicTacToe, App, PlayAGame, NewGameButton, ChooseOpponent, WatchADemo, BoardKit, BoardView, StatusLine, Engine, GameState, Rules, GameReducer, ComputerPlayer, UiKit, "Stack", "Text", "Button", "Segmented". Row i (counting from 0) is a rect at y 4 + 28 × i, height 22, width 180, rx 6, at x 4 for TicTacToe, x 28 for App, BoardKit, Engine and UiKit, x 76 for NewGameButton and ChooseOpponent, and x 52 for every other node; filled with the same level colors as the wide drawing. Its name is at the rect's x + 10, vertically centred, text-anchor start, dominant-baseline central, font-size 13, weight 700, fill color.on.accent
    outline.lines  drawn first, stroke color.border, stroke-width 1.5, fill none: for each child, a vertical line at the parent's x + 10 from the parent rect's bottom down to the child row's vertical centre, then a horizontal line from there to the child rect's left edge. Drawn over them, the thread, stroke color.thread, stroke-width 4, stroke-linecap round: lines 14,26 to 14,267 and 14,267 to 28,267 (to Engine), then 38,278 to 38,379 and 38,379 to 52,379 (to ComputerPlayer)
  copy
    tree.figure.label  "The Tic-Tac-Toe spec as a tree: every node, with the path from TicTacToe through Engine down to ComputerPlayer highlighted"
  binds
    svg       svg and outline each have role img with aria-label from tree.figure.label; they are switched only by their classes "ail-wide" and "ail-narrow" (so the hidden one also leaves the accessibility tree), and the wide svg comes first in the DOM
```
