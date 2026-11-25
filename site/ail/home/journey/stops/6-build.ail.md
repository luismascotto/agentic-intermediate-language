# Stop 6: the build

```ail
node StopBuild : view   level: experience
  why   Show what the build produces from the specialist node, and how little of it a person has to read.   <- Journey
  what
    the sixth stop, in the build color, showing the start and end of the generated file
    Scenario: the build
      Given the page is open
      Then the article "stop-6" has the level 3 heading "Build: an agent compiles the node, seeing only its own slice."
      And the region named "Generated code excerpt" shows its seven lines, with "export function choose" highlighted
  look
    stop     JourneyStop with number 6, color color.level.build, figure BuildFigure
  copy
    build.depth     "build"
    build.chip      "BUILD"
    build.reader    "nobody has to: an agent writes it, and reviewers may skim it"
    build.headline  "Build: an agent compiles the node, seeing only its own slice."
    build.body      "ail build hands this node, plus only the contracts of the nodes it uses, to a compiler agent. If something important were left open, the agent would stop and ask instead of guessing. It writes one TypeScript file whose doc comment quotes the clause it implements, and the lock file records a hash of exactly what it saw, so a later hand edit is caught."
    build.label     "Generated code excerpt"
    build.file      "examples/tictactoe/src/gen/engine/computer-player/computer-player.ts (generated, never edited by hand)"
    build.line.1    "/** choose(board: Board, me: Mark = "O") -> number — full minimax over the remaining game tree, memoized by board; among equally scored moves, the lowest index */"
    build.line.2    "export function choose(board: Board, me: Mark = "O"): number {"
    build.line.3    "  let bestIndex = -1;"
    build.line.4    "  let bestScore = -Infinity;"
    build.line.5    "  …"
    build.line.6    "  return bestIndex;"
    build.line.7    "}"
    build.mark      "export function choose"
    build.turns     "One generated file of 69 lines. A reviewer reads the 27-line node instead."
  binds
    stop     JourneyStop with depth build.depth, chip build.chip, reader build.reader, headline build.headline, explanation build.body, lines build.line.1 to build.line.7, label build.label, file build.file, highlight [build.mark], turnsInto build.turns
  uses      JourneyStop, BuildFigure
  children  BuildFigure
```

```ail
node BuildFigure : view   level: experience
  why   Show the compile step as a pipeline, and compare what a reviewer reads with and without the spec.   <- StopBuild
  what
    the node and the contracts it uses go into a compiler agent that sees one slice, and come out as a code file and its test
    under it, two bars compare the 27 lines of the node with the 69 lines of generated code
    Scenario: the picture
      Given the stop is shown
      Then an image named "The ComputerPlayer node goes into a compiler agent and comes out as a 69-line file; a reviewer reads the 27-line node" is shown
      And it contains the texts "compiler", "agent", "27 lines" and "69 lines"
  look
    svg       viewBox 0 0 360 256, width 100%, max-width 360px, height auto, display block
    node      rect x 4 y 20 width 104 height 64 rx 8, fill color.surface, stroke color.border; rect x 4 y 20 width 4 height 64, fill color.level.specialist; mono text at 16, 44, font-size 11, weight 700, fill color.text; texts at 16, 60 and 16, 74, font-size 10, fill color.text.muted
    arrows    lines 108,52 to 126,52 and 234,52 to 248,52, stroke color.text.muted, stroke-width 2
    agent     polygon "128,52 144,14 216,14 232,52 216,90 144,90", fill color.level.build; texts at 180, 46 and 180, 61, text-anchor middle, font-size 13, weight 700, fill color.on.accent; text at 180, 78, text-anchor middle, font-size 11, fill color.on.accent, opacity 0.85
    files     rect x 256 y 24 width 100 height 50 rx 6, fill color.code.border; rect x 250 y 30 width 104 height 50 rx 6, fill color.code; mono texts at 256, 52 (font-size 10, fill color.code.text) and 256, 68 (font-size 10, fill color.code.muted)
    title     text at 4, 124, font-size 12, weight 700, fill color.text
    bar.1     text at 4, 148, font-size 12, fill color.text.muted; rect x 4 y 154 width 138 height 14 rx 3, fill color.level.specialist; text at 148, 165, font-size 12, weight 700, fill color.text
    bar.2     text at 4, 192, font-size 12, fill color.text.muted; rect x 4 y 198 width 352 height 14 rx 3, fill color.code.muted; text at 350, 209, text-anchor end, font-size 12, weight 700, fill color.on.accent
    lock      mono text at 4, 244, font-size 12, fill color.text.muted
  copy
    build.figure.label   "The ComputerPlayer node goes into a compiler agent and comes out as a 69-line file; a reviewer reads the 27-line node"
    build.figure.node    "ComputerPlayer"
    build.figure.uses.1  "+ contracts of"
    build.figure.uses.2  "GameState, Rules"
    build.figure.agent.1 "compiler"
    build.figure.agent.2 "agent"
    build.figure.slice   "sees one slice"
    build.figure.file    "computer-player.ts"
    build.figure.test    "+ its derived test"
    build.figure.title   "What a reviewer reads"
    build.figure.spec    "the ComputerPlayer node"
    build.figure.speclen "27 lines"
    build.figure.code    "the generated computer-player.ts"
    build.figure.codelen "69 lines"
    build.figure.lock    "ail.lock.json pins the file to its node's hash"
  binds
    svg       role img with aria-label from build.figure.label
```
