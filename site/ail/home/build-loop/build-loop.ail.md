# How it builds

The day-to-day loop: write, build, check, and answer the compiler's questions.

```ail
node BuildLoop : view   level: experience
  why   Show that AIL is a way of working, not only a format: changes go into the spec, and the tools do the rest.   <- HomePage
  what
    a dark band, like the code panels, with a heading, four numbered steps side by side when there is room, and an example of a question the compiler asks instead of guessing
    the example is labelled as an example question, and a note in plain words says how the real Tic-Tac-Toe spec already answers it and which node holds the answer
    Scenario: four steps
      Given the page is open
      Then the section with the id "loop" lists the steps "Write", "Build", "Check" and "Ask", in that order
      And it shows the text "Example question."
      And it shows the text "(see the GameReducer node)"
  look
    band      a section element with id "loop": full width, box-sizing border-box, background color.code, color color.code.text, pad clamp(40px, 10vw, 64px) above and below, space.4 left and right, scroll-margin-top space.4
    column    inside, a div with max-width width.content, margin 0 auto, width 100%; stack(v, gap: space.8, align: stretch) [ head, steps, stop ]
    head      stack(v, gap: space.3, align: start) [ eyebrow, heading, lead ]
    eyebrow   a p: font.tiny, weight 700, letter-spacing 0.12em, color color.dot.amber, margin 0
    heading   an h2: font.display at font.heading, weight 700, line-height 1.1, letter-spacing -0.01em, color color.code.text, margin 0
    lead      a p: font.lead, line-height 1.6, color color.code.muted, max-width width.prose, margin 0
    steps     an ol styled directly (not a Stack): list-style none, margin 0, pad 0, display grid, grid-template-columns repeat(auto-fit, minmax(min(220px, 100%), 1fr)), gap space.4
    step      an li styled directly: a 1px solid color.code.border border, radius.lg, pad clamp(16px, 4vw, 24px), display flex, flex-direction column, gap space.2; holding [ number, title, text ]
    number    a span showing the step's number from copy (loop.n1 to loop.n4): display block, font.display at clamp(28px, 7vw, 40px), weight 800, line-height 1; Write color.thread, Build color.dot.amber, Check color.dot.green, Ask color.dot.red
    title     an h3: font.lead, weight 700, color color.code.text, margin 0
    text      a p: font.body, line-height 1.6, color color.code.muted, margin 0
    stop      a div: background color.code.pick, a 1px solid color.code.border border, radius.md, pad space.4; the question as a p in font.mono at font.code, color color.code.text, margin 0, with its first word in weight 700, color color.dot.amber; then the note as a p in font.small, color color.code.muted, margin space.2 0 0
  copy
    loop.n1         "1"
    loop.n2         "2"
    loop.n3         "3"
    loop.n4         "4"
    loop.eyebrow    "HOW IT BUILDS"
    loop.heading    "How a spec becomes code you can trust"
    loop.lead       "Four steps, repeated for every change. You only ever edit the spec."
    loop.1.title    "Write"
    loop.1.text     "Change the spec, in plain words or with the help of Claude Code, Cursor or Copilot. Generated code is never edited by hand."
    loop.2.title    "Build"
    loop.2.text     "ail build recompiles only the nodes whose slice changed: their own spec, the contracts of the nodes they use, or shared parts like the tokens. Each node is compiled by an agent that sees only that slice."
    loop.3.title    "Check"
    loop.3.text     "Every build ends by checking: it lints the spec, confirms every file was built from it, runs every example, scenario and verify line as a test, and has a model compare each screen with its look."
    loop.4.title    "Ask"
    loop.4.text     "When the spec leaves a gap, the compiler doesn't guess. It replies STOP with a question, and the answer goes into the spec."
    loop.stop.word  "STOP:"
    loop.stop.text  " after switching to the computer, does “New game” keep the computer as the opponent?"
    loop.stop.note  "Example question. In the real Tic-Tac-Toe spec the answer is already written down: “New game” keeps the opponent you chose (see the GameReducer node)."
  uses      Stack
```
