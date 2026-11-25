# Stop 7: the proof

```ail
node StopProof : view   level: experience
  why   Show that the promise is not taken on trust: the verify line became a test that plays every game, and what the player sees is proven and pictured too.   <- Journey
  what
    the seventh stop, in the build color, showing the derived check, and screenshots of the screens the demo's checks end on
    it says that every check's final screen is screenshotted, compared with the spec's look by a model, and committed next to the checks
    Scenario: the proof
      Given the page is open
      Then the article "stop-7" has the level 3 heading "Proof: the verify line becomes a test that plays every game."
      And the region named "Derived check excerpt" shows its seven lines, with "never loses" highlighted
  look
    stop     JourneyStop with number 7, color color.level.build, figure ProofScreens
  copy
    proof.depth     "proof"
    proof.chip      "PROOF"
    proof.reader    "everyone: a green check means the sentence at the top is true"
    proof.headline  "Proof: the verify line becomes a test that plays every game."
    proof.body      "The verify line from the specialist level became a derived check, pinned to a hash of the node: it plays every possible game against the computer and asserts that X never wins. What people see is proven too. The final screen of every check is screenshotted, a model compares it with the spec's look, and the screenshots are committed next to the checks, so a reviewer sees exactly what was proven. Every ail build runs it all, on your machine and in CI."
    proof.label     "Derived check excerpt"
    proof.file      "examples/tictactoe/checks/engine/computer-player/computer-player.test.ts"
    proof.line.1    "// ail-derived-from: ComputerPlayer@0c990bfbddc62e20"
    proof.line.2    "test("never loses", () => {"
    proof.line.3    "  …"
    proof.line.4    "  explore(Array(9).fill(null), "X");"
    proof.line.5    "  expect(games).toBeGreaterThan(0);"
    proof.line.6    "  expect(xWins).toBe(0);"
    proof.line.7    "});"
    proof.mark.1    "never loses"
    proof.mark.2    "expect(xWins).toBe(0);"
    proof.turns     "A green ail build, and committed screenshots of what it proved. If a change to the spec or the code ever let X win, or changed how the game looks, the build would fail and the change would be rejected."
  binds
    stop     JourneyStop with depth proof.depth, chip proof.chip, reader proof.reader, headline proof.headline, explanation proof.body, lines proof.line.1 to proof.line.7, label proof.label, file proof.file, highlight [proof.mark.1, proof.mark.2], turnsInto proof.turns
  uses      JourneyStop, ProofScreens
  children  ProofScreens
```

```ail
node ProofScreens : view   level: experience
  why   Show that proof covers what people see, too: the screens the checks end on are pictured, judged against the look, and committed.   <- StopProof
  what
    two screenshots of the demo's play screen, taken at the end of its checks "winning" and "the computer answers", side by side when there is room, each with a check mark and the check's name under it
    under them, a line says the screenshots are committed with the checks, and where
    Scenario: the screens
      Given the stop is shown
      Then it shows the images named "Screenshot at the end of the check “winning”" and "Screenshot at the end of the check “the computer answers”", in that order
      And it shows a line containing "examples/tictactoe/checks/shots/"
  look
    layout   stack(v, gap: space.3, align: stretch) [ grid, where ]
    grid     a div: display grid, grid-template-columns repeat(auto-fit, minmax(min(128px, 100%), 1fr)), gap space.3, width 100%
    shot     a figure element: margin 0, display flex, flex-direction column, gap space.1
    frame    an img: display block, width 100%, height auto, box-sizing border-box, background color.surface, a 1px solid color.border border, radius.md
    caption  a figcaption: font.tiny, color.text.muted, text-align center; the check mark in color.pass, weight 700, then one space, then the check's name in quotes
    where    a p: font.tiny, color.text.muted, margin 0, text-align center, overflow-wrap anywhere; the path in font.mono
  copy
    proof.shots.alt    "Screenshot at the end of the check “{test}”"
    proof.shots.mark   "✓"
    proof.shots.where  "Committed with the checks, in"
    proof.shots.path   "examples/tictactoe/checks/shots/"
  binds
    data     specProjects from the spec module: of the project with key "tictactoe", the shots of node "PlayAGame" whose test is "winning", then the one whose test is "the computer answers"; a missing one is left out
    img      src the shot's src; alt from proof.shots.alt with {test} filled in
    caption  proof.shots.mark, one space, then “ + the shot's test + ”
    where    proof.shots.where, one space, then the path in a code element
  uses     Stack
```
