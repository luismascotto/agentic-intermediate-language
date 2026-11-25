# Watch it work

Two short walkthroughs of the real tools on the Tic-Tac-Toe demo: `ail build`
compiling a small spec change into checked code, and `ail adopt` bringing an
old app under a spec. Nothing moves until the visitor presses Play. The
contents of the walkthroughs are data, in [`walkthrough/`](walkthrough/); the
pieces of the player are in [`stage.ail.md`](stage.ail.md).

```ail
node WatchSection : view   level: experience
  why   Reading about a build is not the same as seeing one: show ail build and ail adopt at work on the real demo, at the visitor's own pace.   <- HomePage
  what
    the section has the id "watch", so the page can link to it
    an eyebrow, a heading and one sentence on what the two walkthroughs show, then the walkthrough player
    Scenario: the section
      Given the page is open
      Then the section with the id "watch" has the level 2 heading "Watch AIL build, and adopt"
      And "SEE IT RUN" is shown above the heading
  look
    band    Section with id "watch", tone raised
    layout  the band holds [ head, WalkthroughPlayer ], with the band's own gap between them
    head    SectionHeading with eyebrow from watch.eyebrow, text from watch.heading, lead from watch.lead
  copy
    watch.eyebrow  "SEE IT RUN"
    watch.heading  "Watch AIL build, and adopt"
    watch.lead     "Two short walkthroughs you can pause on any chapter: a spec change built into checked code, and an old app described by a spec and proven against it."
  uses      Section, SectionHeading, WalkthroughPlayer
  children  WalkthroughPlayer
```

```ail
node WalkthroughPlayer : flow   level: experience
  why   Show each step of a real build and a real adoption in the order the tools take them, in a player the visitor controls.   <- WatchSection
  what
    a dark player window with two walkthroughs as tabs, "ail build" and "ail adopt"; "ail build" is shown first
    the shown chapter has its terminal output on the left and the spec tree in that chapter's state on the right, then its number, title and caption, the controls and the row of chapters; on a narrow screen the chapter's nodes go under the terminal as a short list
    it never plays by itself: it opens paused on chapter 1, showing that chapter complete, with a large play button over the stage
    while it plays, the time moves on every tenth of a second, the chapter's terminal lines appear one after another with a still caret after the last, and at the end of a chapter the next one starts; after the last chapter it stops, and the play button reads "Replay"
    whenever it is not playing, the shown chapter's terminal lines are all shown, with no caret
    picking a chapter, or going to the previous or the next one, shows that chapter complete while paused, and plays it from its beginning while playing
    switching walkthroughs shows chapter 1 of the other one, paused, with the large play button again
    Scenario: it opens paused
      Given the page is open
      Then the tab "ail build" is selected and the chapter heading reads "The spec changes, not code"
      And "Chapter 1 of 10" and the terminal line "$ ail build" are shown, and the time reads "0:06 / 1:25"
      And the buttons "Play the walkthrough (1:25)" and "Play" are shown
    Scenario: the other walkthrough
      Given the page is open
      When the visitor picks the tab "ail adopt"
      Then the tab "ail adopt" is selected and "ail build" is not
      And the chapter heading reads "An old app, no spec" and the time reads "0:06 / 1:38"
    Scenario: picking a chapter
      Given the page is open
      When the visitor presses the button "Chapter 3: Checks written once, then pinned"
      Then the chapter heading reads "Checks written once, then pinned" and that button is the current step
      And the terminal shows all four of its lines, the first being "· App: deriving checks from its scenarios"
      When the visitor presses the button "Chapter 10: Everything checks out"
      Then the button "Next chapter" is disabled
    Scenario: next and previous
      Given the page is open
      Then the button "Previous chapter" is disabled
      When the visitor presses "Next chapter"
      Then the chapter heading reads "What is out of date"
      When the visitor presses "Previous chapter"
      Then the chapter heading reads "The spec changes, not code"
    Scenario: arrow keys
      Given the tab "ail build" has focus
      When the visitor presses the right arrow key
      Then the tab "ail adopt" is selected and has focus
      When the visitor presses the left arrow key
      Then the tab "ail build" is selected and has focus
    Scenario: playing
      Given the page is open
      When the visitor presses "Play"
      Then the button "Pause" is shown, "Play the walkthrough (1:25)" is gone, and the time reads "0:00 / 1:25"
      When 1500 ms pass
      Then the time reads "0:01 / 1:25"
      When the visitor presses "Pause"
      Then the button "Play" is shown
  how
    decide it never starts by itself
      because content that moves on its own distracts people who are reading and fails those who need the page to stay still
      rejected starting when the section scrolls into view because it would start while someone is still reading above it
    decide a paused chapter is shown complete
      because a visitor who jumps to a chapter wants to read all of it, without waiting on a timer
  look
    window    a div with role region named by watch.player: radius.lg, overflow hidden, a 1px solid color.code.border border, background color.code, box-shadow 0 12px 32px rgba(15, 23, 42, 0.18); holding [ WalkTitleBar, panel ]
    panel     a div with role tabpanel; holding [ stage, WalkCaption, WalkControls, timeline ]
    stage     a div: position relative, display flex, flex-wrap wrap, overflow hidden, a 1px solid color.code.border bottom border; holding [ a div with position relative, flex 1 1 320px and min-width 0 holding [ WalkTerminal, big ], a div with flex 1.4 1 400px, min-width 0 and box-shadow -1px 0 0 color.code.border, 0 -1px 0 color.code.border (a hairline on its left when side by side and on its top when stacked) holding WalkPicture ]
    big       a native button with type "button" over the middle of the terminal pane (so it never covers the tree): position absolute, top 50%, left 50%, transform translate(-50%, -50%), max-width 90%, pad space.3 space.6, radius.pill, border none, background color.accent, color color.on.accent, font.sans at clamp(16px, 4vw, 18px), weight 700, line-height 1.3, min-height 44px, text-align center, box-shadow 0 8px 24px rgba(0, 0, 0, 0.4), cursor pointer
    timeline  a div with pad 0 space.4 space.4 holding WalkTimeline
  copy
    watch.player  "Walkthrough player"
    watch.big     "Play the walkthrough ({total})"
  binds
    data      BUILD and ADOPT: the shown walkthrough w is BUILD while tab is "build" and ADOPT otherwise; beat is w.beats[chapter]; last is the index of w's final beat
    state     tab: "build" | "adopt", starting at "build"; chapter: integer, starting at 0; elapsed: integer, the milliseconds played of the chapter, starting at 0; playing: boolean, starting at false; started: boolean, starting at false
    complete  not playing and elapsed is 0: the chapter is shown complete; ended is not playing, chapter is last and elapsed is beat.seconds × 1000
    timer     while playing: every 100 ms add 100 to elapsed; once elapsed reaches beat.seconds × 1000, move to chapter + 1 with elapsed 0 when chapter is not last, otherwise set elapsed to beat.seconds × 1000 and playing to false; clear the interval in the effect's cleanup
    go        go(k) sets chapter to k kept between 0 and last, elapsed to 0 and started to true, and leaves playing as it is
    panel     id "walk-panel", aria-labelledby "walk-tab-{tab}"
    big       shown only while started is false; text watch.big with total = clock(totalSeconds(w)); pressing it sets playing and started to true, and also moves focus to the element with id "walk-play"
    WalkTitleBar  tab = tab; now = clock(chapterStart(w, chapter) + beat.seconds) while complete, otherwise clock(chapterStart(w, chapter) + the whole seconds in elapsed); total = clock(totalSeconds(w)); onPick(t) does nothing when t is tab, and otherwise sets tab to t, chapter and elapsed to 0, playing and started to false
    WalkCaption   n = chapter + 1, count = the number of w's beats, branch = beat.branch, title = beat.title, caption = beat.caption
    WalkControls  mode "pause" while playing, "replay" while ended, "play" otherwise; first = chapter is 0; last = chapter is last; onPrevious = go(chapter − 1); onNext = go(chapter + 1); onPlay sets started to true, then sets playing to false while playing, goes to chapter 0 with elapsed 0 and plays while ended, and otherwise sets playing to true
    WalkTerminal  place = w.place; lines = the first linesShown(the number of beat.lines, beat.seconds, elapsed) of beat.lines while playing, otherwise all of beat.lines; caret = playing
    WalkPicture   walkthrough = w, chapter = chapter
    WalkTimeline  beats = w.beats, chapter = chapter, played = 1 while complete, otherwise elapsed / (beat.seconds × 1000); onPick(k) = go(k)
  uses      Walkthrough, BuildWalkthrough, AdoptWalkthrough, WalkTitleBar, WalkTerminal, WalkPicture, WalkCaption, WalkControls, WalkTimeline
  children  Walkthrough, BuildWalkthrough, AdoptWalkthrough, WalkTitleBar, WalkTerminal, WalkPicture, WalkCaption, WalkControls, WalkTimeline
```
