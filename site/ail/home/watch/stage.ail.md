# The player's parts

The terminal, the spec tree, the chapter's inset, the controls and the row of
chapters. They only show what the player hands them; the player alone keeps
state and runs the timer.

```ail
node WalkTitleBar : view   level: experience
  why   The player looks like a terminal window, with the two walkthroughs as its tabs and the time at its right end.   <- WalkthroughPlayer
  what
    three window dots, the tabs "ail build" and "ail adopt", then the time played and the total time
    the left and right arrow keys move between the two tabs, and move focus with them
    Scenario: the tabs
      Given the tab "build" and the times "0:06" and "1:25"
      Then the tablist named "Walkthroughs" has the tabs "ail build" and "ail adopt", in that order, and only "ail build" is selected
      And "0:06 / 1:25" is shown
    Scenario: arrow keys
      Given the tab "build", with the tab "ail build" focused
      When the visitor presses the right arrow key
      Then the bar asks for the tab "adopt", once, and the tab "ail adopt" has focus
  look
    bar      a div: display flex, flex-wrap wrap, align-items center, gap space.3, pad space.1 space.3, background color.code.bar, a 1px solid color.code.border bottom border; holding [ dots, tabs, time ]
    dots     an aria-hidden div with three 10px circles 6px apart: color.dot.red, color.dot.amber, color.dot.green
    tabs     a div with role tablist: display flex, gap space.1
    tab      a native button with type "button": height 44px, pad 0 space.3, radius.md, border none, font.mono at font.small, weight 600, cursor pointer; the picked tab has background color.code.pick and color color.code.text, the other background transparent and color color.code.muted
    time     a p: margin 0 0 0 auto, font.mono at font.small, color color.code.muted; now in a span with color color.code.text, then the rest of walk.time
  copy
    walk.tabs        "Walkthroughs"
    walk.tab.build   "ail build"
    walk.tab.adopt   "ail adopt"
    walk.time        "{now} / {total}"
  binds
    props    tab: "build" | "adopt", now: text, total: text, onPick(tab: "build" | "adopt")
    tablist  aria-label from walk.tabs
    time     never in a live region
    tab      role tab, id "walk-tab-{key}", aria-selected, aria-controls "walk-panel", tabIndex 0 when picked and -1 otherwise; a click calls onPick with its key; ArrowRight and ArrowLeft call onPick with the other key (with two tabs both wrap) and focus that tab
```

```ail
node WalkCaption : view   level: experience
  why   Every chapter says where it is in the walkthrough, what it is called and what it shows, in plain words.   <- WalkthroughPlayer
  what
    the chapter's number out of all of them, its title as a level 3 heading, then its caption; a branch chapter says that it is a branch off the main path
    Scenario: a branch chapter
      Given chapter 7 of 10, a branch, titled "Branch: the spec must decide" with the caption "Suppose only what had changed."
      Then "Chapter 7 of 10 · a branch off the main path" is shown
      And the level 3 heading reads "Branch: the spec must decide", with "Suppose only what had changed." under it
  look
    strip    a div: display flex, flex-direction column, gap space.1, pad space.3 space.4, background color.code.bar, a 1px solid color.code.border bottom border; holding [ count, title, caption ]
    count    a p: margin 0, font.mono at font.tiny, color color.code.muted
    title    an h3: margin 0, font.sans at font.body, weight 700, line-height 1.4, color color.code.text
    caption  a p: margin 0, font.small, line-height 1.6, color color.code.text, max-width width.prose
  copy
    walk.count   "Chapter {n} of {count}"
    walk.branch  "Chapter {n} of {count} · a branch off the main path"
  binds
    props    n: integer, count: integer, branch: boolean, title: text, caption: text
    count    walk.branch when branch is true, otherwise walk.count
    strip    aria-live "polite" and aria-atomic "true", so a chapter that changes while playing is announced
```

```ail
node WalkTerminal : view   level: experience
  why   The terminal is where a person meets the tools, so each chapter shows exactly what they print.   <- WalkthroughPlayer
  what
    a header naming where the commands run, then the given lines exactly, one per line, keeping every space; long lines wrap and are never cut off
    a line that starts with a prompt ("$ " or "> ") shows the prompt in the thread colour
    a line whose first visible mark is ✓, ✗, ! or ? is green, red, amber or yellow; the mark itself says what the line is, so colour is never the only sign
    when asked, a still block caret follows the last line; it never blinks
    with no lines, it says that nothing is printed in this chapter
    on a narrow screen the terminal keeps room for about six lines, so the parts under it move little while lines appear; side by side with the tree it stretches to the tree's height
    Scenario: lines kept exactly
      Given the place "terminal · examples/tictactoe" and the lines "$ ail build" and "✓ spec     no errors"
      Then the region named "Terminal output" shows exactly those two lines, each on its own line, with their spaces kept
      And the first line's prompt "$ " is a part of its own
    Scenario: the caret
      Given the lines "· App: deriving checks from its scenarios" and a caret
      Then exactly one caret is shown, after that line
    Scenario: nothing printed
      Given no lines
      Then "Nothing is printed in this chapter." is shown
  look
    root     a div: display flex, flex-direction column, height 100%, background color.code; holding [ head, body ]
    head     a p: margin 0, pad space.2 space.4, font.mono at font.tiny, color color.code.muted, a 1px solid color.code.border bottom border, overflow-wrap anywhere
    body     a div: flex 1 1 auto, min-height clamp(9em, 40vw, 320px), box-sizing border-box, pad space.3 space.4, font.mono at font.code, line-height 1.5, color color.code.text
    line     a div per line: margin 0, min-height 1.5em, white-space pre-wrap, overflow-wrap anywhere
    prompt   a span: color color.thread, weight 700
    marks    by the line's first non-space character: ✓ color color.dot.green, ✗ color color.dot.red, ! color color.dot.amber, ? color color.thread; any other line color.code.text
    caret    an aria-hidden span: display inline-block, width 0.6em, height 1.1em, margin-left 2px, vertical-align text-bottom, background color.thread; no animation
    empty    a p: margin 0, font.sans at font.small, font-style italic, color color.code.muted
  copy
    walk.term.label  "Terminal output"
    walk.term.empty  "Nothing is printed in this chapter."
  binds
    props    place: text, lines: list of text, caret: boolean
    body     role region with aria-label from walk.term.label
    prompt   a line that starts with "$ " or "> " is the span data-part "prompt" holding those two characters, then the rest of the line
    caret    the span data-part "caret", inside the last line, only when caret is true and there is a line
```

```ail
node WalkPicture : view   level: experience
  why   Show which nodes of the spec a chapter touches and the state of each, so a build reads as work on a tree rather than a wall of log lines.   <- WalkthroughPlayer
  what
    the walkthrough's picture title, then the 16 compiled Tic-Tac-Toe nodes as boxes: the app and its screens as a tree on top, then the three libraries as bands with their nodes inside
    each box shows the node's name and its state, by its outline and by a short word, so the state never depends on colour alone; a node with no spec yet has a dotted outline, a muted name and no word
    under the tree, the chapter's inset, then, at 600px viewport width or more, a legend listing every state the walkthrough uses, each with its outline and what it means
    at 600px viewport width or more the whole tree is visible: it scales down with the space it has, and never scrolls or is cut off; below 600px it is replaced by a wrapped list of chips, "Name · word", for just the nodes whose state differs from the rest state, then a muted line saying how many other nodes there are and what their state means
    Scenario: a stale chapter
      Given the build walkthrough at its second chapter
      Then the image named "Tic-Tac-Toe spec · 16 nodes: TicTacToe: up to date; App: out of date; …" is shown, its name listing all 16 nodes in drawing order
      And the boxes of "WatchADemo" and "App" read "stale", and the box of "Rules" reads "✓ fresh"
    Scenario: nodes with no spec yet
      Given the adopt walkthrough at its first chapter
      Then the box of "PlayAGame" reads "the slice", and the box of "App" shows no word
      And the legend includes "no spec yet"
  look
    root     a div: display flex, flex-direction column, gap space.3, pad space.4, height 100%, box-sizing border-box, background color.code.side; holding [ title, row, legend ]; the title is a p: margin 0, font.sans at font.tiny, weight 700, letter-spacing 0.08em, text-transform uppercase, color color.code.muted
    row      a div: display flex, flex-direction column, gap space.4, align-items stretch; holding [ tree, chips, WalkInset with inset = walkthrough.beats[chapter].inset, in a div with min-width 0 ]
    tree     a div with class "ail-wide" and min-width 0 holding an svg: viewBox 0 0 480 436, width 100%, max-width 480px, height auto, display block, margin 0 auto (it scales down to the width it has)
    chips    a div with class "ail-narrow" (shown only below 600px viewport width) holding [ chiplist, rest ]; it sets no display of its own, because the class sets it; the chiplist is a ul: list-style none, margin 0, pad 0, display flex, flex-wrap wrap, gap space.2; the rest is a p: margin space.2 0 0, font.sans at font.small, color color.code.muted
    chip     an li: display inline-flex, align-items center, gap space.1, pad space.1 space.2, radius.md, background color.code (none for unwritten), a border in the state's stroke color and width, solid, or dotted for dasharray 1 2 and 2 3, or dashed for any other dasharray; font.sans at font.small, line-height 1.4, color color.code.text; the name in weight 600, then " · ", then the word in weight 700 in the state's word color; a state with no word shows only the name, in color.code.muted
    edges    drawn first, lines with stroke color.code.muted, stroke-width 1.5: 240,40 to 240,60; 240,96 to 144,116; 240,96 to 336,116; 144,152 to 74,172; 144,152 to 222,172
    bands    rects x 0, width 480, height 64, rx 8, fill color.code.bar, stroke color.code.border, stroke-width 1, at y 224, 296 and 368; in each a mono text at x 10, y band + 15, font-size 10, fill color.code.muted: "UiKit · library", "BoardKit · library", "Engine · library"
    boxes    rects height 36, rx 6: "TicTacToe" x 170 y 4 w 140; "App" x 170 y 60 w 140; "PlayAGame" x 74 y 116 w 140; "WatchADemo" x 266 y 116 w 140; "ChooseOpponent" x 4 y 172 w 140; "NewGameButton" x 152 y 172 w 140; "Stack" x 10 y 246 w 108; "Text" x 126 y 246 w 108; "Button" x 242 y 246 w 108; "Segmented" x 358 y 246 w 112; "BoardView" x 10 y 318 w 140; "StatusLine" x 158 y 318 w 140; "GameState" x 10 y 390 w 108; "Rules" x 126 y 390 w 108; "GameReducer" x 242 y 390 w 108; "ComputerPlayer" x 358 y 390 w 112
    labels   text-anchor middle at the box's horizontal centre: the name at y box + 15, font-size 12, weight 600, fill color.code.text; the word at y box + 29, font-size 10, weight 700; a box with no word has its name at y box + 22
    fresh      stroke color.dot.green, stroke-width 1.5, fill color.code; word in color.dot.green
    stale      stroke color.dot.amber, stroke-width 1.5, fill color.code; word in color.dot.amber
    writing    stroke color.thread, stroke-width 1.5, fill color.code; word in color.thread
    compiling  stroke color.thread, stroke-width 3, fill color.code; word in color.thread
    contract   stroke color.dot.green, stroke-width 1.5, stroke-dasharray 1 2, fill color.code; word in color.thread
    checking   stroke color.thread, stroke-width 1.5, stroke-dasharray 4 3, fill color.code; word in color.thread
    rejected   stroke color.dot.red, stroke-width 1.5, fill color.code; word in color.dot.red
    stopped    stroke color.dot.red, stroke-width 3, fill color.code; word in color.dot.red
    skipped    stroke color.code.muted, stroke-width 1.5, stroke-dasharray 4 3, fill color.code; word in color.code.muted
    unwritten  stroke color.code.muted, stroke-width 1.5, stroke-dasharray 2 3, fill none; no word; name in color.code.muted
    slice      stroke color.thread, stroke-width 2, stroke-dasharray 6 3, fill color.code; word in color.thread
    written    stroke color.code.text, stroke-width 1.5, fill color.code; word in color.code.text
    adopted    stroke color.level.experience, stroke-width 1.5, stroke-dasharray 5 3, fill color.code; word in color.level.experience
    proven     stroke color.pass, stroke-width 3, fill color.code; word in color.dot.green
    legend   a ul with class "ail-wide": list-style none, margin 0, pad 0, display flex, flex-wrap wrap, gap space.1 space.4, font.sans at font.tiny, color color.code.muted; each li: display flex, align-items center, gap space.2; an aria-hidden svg, viewBox 0 0 16 12, width 16px, height 12px, holding a rect x 1 y 1 width 14 height 10 rx 2 with that state's stroke, dasharray and fill and stroke-width 1.5, then the state's meaning
  copy
    walk.tree.label   "{picture}: {nodes}"
    walk.tree.node    "{name}: {meaning}"
    walk.word.fresh "✓ fresh"
    walk.word.stale "stale"
    walk.word.writing "writing"
    walk.word.compiling "building"
    walk.word.contract "contract only"
    walk.word.checking "checking"
    walk.word.rejected "rejected"
    walk.word.stopped "STOP"
    walk.word.skipped "skipped"
    walk.word.slice "the slice"
    walk.word.written "written"
    walk.word.adopted "adopted"
    walk.word.proven "✓ proven"
    walk.mean.fresh "up to date"
    walk.mean.stale "out of date"
    walk.mean.writing "spec being written"
    walk.mean.compiling "being compiled"
    walk.mean.contract "only its contract is sent"
    walk.mean.checking "being checked"
    walk.mean.rejected "attempt rejected"
    walk.mean.stopped "stopped with a question"
    walk.mean.skipped "waits for a node above it"
    walk.mean.unwritten "no spec yet"
    walk.mean.slice "the slice being adopted"
    walk.mean.written "spec written"
    walk.mean.adopted "adopted, not checked yet"
    walk.mean.proven "checked and proven"
    walk.chips "Nodes this chapter touches"
    walk.rest "the other {count} nodes: {meaning}"
    walk.rest.all "all {count} nodes: {meaning}"
  binds
    props    walkthrough: Walkthrough, chapter: integer
    words    each node's state is stateOf(walkthrough, chapter, its name); a box's word is walk.word.{its state}, and none for "unwritten"; its meaning, in the aria-label and in the legend, is walk.mean.{its state}; the legend has one li per state of statesIn(walkthrough), in that order
    svg      the tree has role img and aria-label walk.tree.label, with picture = walkthrough.picture and nodes = walk.tree.node with name the node and meaning walk.mean.{its state}, for each of NODES in order, joined by "; "; each node is a g with data-node its name and data-state its state; bands and edges are inside an aria-hidden g
    chips    one chip per name of NODES, in order, whose stateOf differs from walkthrough.rest; the ul has aria-label walk.chips; rest reads walk.rest with count = the number of nodes left out and meaning = walk.mean.{walkthrough.rest} (the meaning, not the word, because unwritten has no word), or walk.rest.all with count 16 when no node differs, and is left out when every node differs
  uses      Walkthrough, WalkInset
  children  WalkInset
```

```ail
node WalkInset : view   level: experience
  why   Each chapter has one detail worth a closer look: a card of what the tool reads or writes, or a screenshot of the app it checks.   <- WalkPicture
  what
    a card shows its label and then its lines in a small code font, each on its own line, keeping their spaces
    a screenshot shows its label, the verdict when there is one, and the committed screenshot of that node at the end of that check
    a screenshot that is not among the committed ones shows nothing, and neither does an inset of kind none
    Scenario: a card
      Given a card labelled "Compile context: WatchADemo" with the lines "Target, design tokens, glossary" and "Why chain: TicTacToe → App"
      Then "Compile context: WatchADemo" is shown, then those two lines, each on its own line
    Scenario: a screenshot
      Given a screenshot of the node "PlayAGame" at the end of the check "winning", labelled "Your app today · localhost:3000", with the verdict "MATCHES"
      Then the image named "Screenshot of the app at the end of the check “winning”" is shown
      And "Your app today · localhost:3000" and "MATCHES" are shown above it
    Scenario: nothing
      Given an inset of kind none
      Then nothing is shown
  look
    card     a div: display flex, flex-direction column, gap space.2, min-width 0, pad space.3, background color.code, a 1px solid color.code.border border, radius.md
    label    a p: margin 0, font.mono at font.tiny, color color.code.muted, overflow-wrap anywhere, line-height 1.4
    lines    a div: display flex, flex-direction column, gap 0; each line a p: margin 0, font.mono at font.tiny, line-height 1.5, color color.code.text, white-space pre-wrap, overflow-wrap anywhere
    shot     a figure: margin 0, display flex, flex-direction column, gap space.2, min-width 0; holding [ caption, image ]
    caption  a figcaption: display flex, flex-wrap wrap, align-items center, gap space.2; the label in font.sans at font.tiny, weight 700, color color.code.muted; then, when given, the verdict pill
    pill     a span: pad 2px space.2, radius.pill, background color.pass, color color.on.accent, font.micro, weight 700, letter-spacing 0.08em
    image    an img: display block, width auto, height auto, max-width 100%, max-height 240px, align-self flex-start, object-fit contain, box-sizing border-box, background color.surface, a 1px solid color.code.border border, radius.md (at most 240px tall, so a screenshot never makes the player taller)
  copy
    walk.shot.alt  "Screenshot of the app at the end of the check “{test}”"
  binds
    props    inset: Inset
    data     specProjects from the spec module: of the project with key "tictactoe", the last shot whose node and test are the inset's (the end-to-end one when there is one)
    img      src the shot's src; alt from walk.shot.alt with {test} filled in
  uses      Walkthrough
```

```ail
node WalkControls : view   level: experience
  why   Moving through a walkthrough takes one press: back a chapter, play or pause, or on a chapter.   <- WalkthroughPlayer
  what
    three buttons on one row: Previous, the play button and Next, named "Previous chapter" and "Next chapter"
    the play button reads "Play", "Pause" or "Replay", as the player says
    "Previous chapter" is disabled on the first chapter, and "Next chapter" on the last
    Scenario: on the first chapter
      Given the play button reads "Play" on the first of several chapters
      Then the buttons "Previous chapter", "Play" and "Next chapter" are shown, in that order
      And "Previous chapter" is disabled and "Next chapter" is not
    Scenario: moving on
      Given the play button reads "Pause" on a middle chapter
      When the visitor presses "Next chapter"
      Then the controls ask for the next chapter, once
  look
    row       a div: display flex, align-items center, gap space.2, pad space.3 space.4; holding [ previous, play, next ]
    button    previous and next: native buttons with type "button": flex 1 1 0, min-width 0, max-width 160px, height 44px, pad 0 space.2, radius.md, a 1px solid color.code.border border, background transparent, color color.code.text, font.sans at font.small, weight 600, cursor pointer
    play      a native button with type "button": flex 1 1 0, min-width 0, max-width 160px, height 44px, pad 0 space.2, radius.md, a 1px solid color.thread border, background color.thread, color color.code, font.sans at font.small, weight 700, cursor pointer
    disabled  a disabled button has opacity 0.4 and cursor default
  copy
    walk.previous  "Previous chapter"
    walk.next      "Next chapter"
    walk.previous.short  "Previous"
    walk.next.short      "Next"
    walk.play      "Play"
    walk.pause     "Pause"
    walk.replay    "Replay"
  binds
    props    mode: "play" | "pause" | "replay", first: boolean, last: boolean, onPrevious(), onPlay(), onNext()
    buttons  native buttons; previous shows walk.previous.short with aria-label walk.previous; next shows walk.next.short with aria-label walk.next; the play button has id "walk-play"; previous is disabled when first is true, next when last is true; play shows walk.play, walk.pause or walk.replay for its mode
```

```ail
node WalkTimeline : view   level: experience
  why   A visitor should see how long each chapter is and where they are, and reach any chapter in one press.   <- WalkthroughPlayer
  what
    one button per chapter in a row, each as wide as its share of the walkthrough's time
    the chapters before the current one are filled, and the current one as far as it has played
    a branch chapter has a dashed bar, so it reads as a detour from the main path
    at 600px viewport width or more, each chapter's title is shown under its bar
    Scenario: the chapters
      Given the chapters "One" of 6 seconds, "Two" of 9 seconds and "Three" of 9 seconds, with "Two" current and half played
      Then the list named "Chapters" has the buttons "Chapter 1: One", "Chapter 2: Two" and "Chapter 3: Three", in that order
      And only "Chapter 2: Two" is the current step
    Scenario: picking a chapter
      Given the chapters "One", "Two" and "Three"
      When the visitor presses "Chapter 3: Three"
      Then the timeline asks for the third chapter, once
  look
    list     an ol: list-style none, margin 0, pad 0, display flex, gap space.1, align-items flex-start
    item     an li per chapter: flex-grow its seconds, flex-shrink 1, flex-basis 0, min-width 0
    button   a native button with type "button": display flex, flex-direction column, justify-content center, gap space.1, width 100%, min-height 44px, pad space.1 0, margin 0, border none, background transparent, text-align left, cursor pointer
    bar      a span: display block, height 8px, box-sizing border-box, radius.pill, overflow hidden, background color.code.pick, a 1px solid color.code.muted border; a branch chapter's bar instead has background transparent and a 1.5px dashed color.code.muted border
    fill     a span inside the bar: display block, height 100%, radius.pill, background color.thread; width 100% before the current chapter, the played share for the current one, 0% after it
    title    a span with class "ail-wide": display block, font.sans at font.tiny, line-height 1.3, color color.code.muted, overflow-wrap anywhere; the current chapter's title has weight 700 and color color.code.text
  copy
    walk.chapters  "Chapters"
    walk.chapter   "Chapter {n}: {title}"
  binds
    props    beats: list of Beat, chapter: integer, played: number, onPick(chapter: integer)
    list     aria-label from walk.chapters
    button   aria-label from walk.chapter with n = its index + 1 and the beat's title; aria-current "step" on the current chapter only; pressing it calls onPick with its index
    fill     played is a share from 0 to 1 of the current chapter
  uses      Walkthrough
```
