# Stop 3: experience level

```ail
node StopExperience : view   level: experience
  why   Show the experience level: the promise shows up as what the player sees, written as scenarios anyone can test.   <- Journey
  what
    the third stop, in the experience color
    Scenario: the experience level
      Given the page is open
      Then the article "stop-3" has the level 3 heading "Experience level: what the player sees, as scenarios anyone can test."
      And the region named "Experience-level spec excerpt" shows its eleven lines, with "the computer places an O" highlighted
  look
    stop     JourneyStop with number 3, color color.level.experience, figure ExperienceFigure, browse "#spec/tictactoe/app/play/play.ail.md"
  copy
    experience.depth     "depth 2"
    experience.chip      "EXPERIENCE"
    experience.reader    "design, QA and product"
    experience.headline  "Experience level: what the player sees, as scenarios anyone can test."
    experience.body      "One level down, the play screen describes the computer's answer as a Given / When / Then scenario. Decisions record why, and what was rejected: the computer waits 300 ms, so the player's own move feels like it counted."
    experience.label     "Experience-level spec excerpt"
    experience.file      "examples/tictactoe/ail/app/play/play.ail.md"
    experience.line.1    "node PlayAGame : flow   level: experience"
    experience.line.2    "  …"
    experience.line.3    "    Scenario: the computer answers"
    experience.line.4    "      Given the opponent is the computer"
    experience.line.5    "      When X picks a square"
    experience.line.6    "      Then shortly after, the computer places an O"
    experience.line.7    "      And the status says "X's turn" again"
    experience.line.8    "  how"
    experience.line.9    "    decide the computer answers after 300 ms"
    experience.line.10   "      because an instant answer feels like the player's own move didn't count"
    experience.line.11   "      rejected a random pause because it makes behaviour unpredictable and tests slow"
    experience.mark      "the computer places an O"
    experience.turns     "A test that plays X and waits for the computer's O, and a 300 ms timer in the play screen."
  binds
    stop     JourneyStop with depth experience.depth, chip experience.chip, reader experience.reader, headline experience.headline, explanation experience.body, lines experience.line.1 to experience.line.11, label experience.label, file experience.file, highlight [experience.mark], turnsInto experience.turns
  uses      JourneyStop, ExperienceFigure
  children  ExperienceFigure
```

```ail
node ExperienceFigure : view   level: experience
  why   Show the scenario as three frames a designer would sketch.   <- StopExperience
  what
    three small boards: empty, then X in the center, then an O answering in the top-left corner, with "300 ms" between the last two and the status line under them
    Scenario: the picture
      Given the stop is shown
      Then an image named "Three frames: an empty board, X in the center, then O answers after 300 ms" is shown
      And it contains the texts "Given:", "vs computer", "When:", "X picks", "Then:", "O answers" and "300 ms"
  look
    svg       viewBox 0 0 360 176, width 100%, max-width 360px, height auto, display block
    frames    MiniBoard at x 6, 141 and 276, y 10, cell 26, with marks "_________", "____X____" and "O___X____"
    arrows    lines 90,49 to 133,49 and 225,49 to 268,49, stroke color.text.muted, stroke-width 2; heads path "M127 44 L135 49 L127 54 Z" and "M262 44 L270 49 L262 54 Z", fill color.text.muted
    watch     circle cx 247 cy 26 r 8, fill none, stroke color.text.muted, stroke-width 1.5; hand line 247,26 to 247,21; button line 247,16 to 247,14, both stroke color.text.muted, stroke-width 1.5
    delay     mono text at 247, 72, text-anchor middle, font-size 12, fill color.text
    captions  two text lines under each board, at x 45, 180 and 315, text-anchor middle, font-size 14, fill color.text.muted: the first line (experience.figure.1a, 2a and 3a) at y 106 in weight 700, the second line (experience.figure.1b, 2b and 3b) at y 122
    status    rect x 120 y 132 width 120 height 32 rx 16, fill color.surface, stroke color.border; text at 180, 153, text-anchor middle, font-size 16, weight 600, fill color.text, its X in a tspan with fill color.player.x
  copy
    experience.figure.label  "Three frames: an empty board, X in the center, then O answers after 300 ms"
    experience.figure.1a     "Given:"
    experience.figure.1b     "vs computer"
    experience.figure.2a     "When:"
    experience.figure.2b     "X picks"
    experience.figure.3a     "Then:"
    experience.figure.3b     "O answers"
    experience.figure.delay  "300 ms"
    experience.figure.mark   "X"
    experience.figure.turn   "'s turn"
  binds
    svg       role img with aria-label from experience.figure.label
  uses  MiniBoard
```
