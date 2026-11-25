# Home page

The whole site is one page, read top to bottom. Its centre is the journey:
one sentence followed down every level of the real Tic-Tac-Toe spec.

```ail
node HomePage : view   level: experience
  why   One page that says what AIL is, shows it working on a real spec from the first sentence to the running game, and shows how to start.   <- AIL
  what
    the parts appear in this order: TopBar, Hero, GapStrip, TreeSection, Journey, WatchSection, Readers, BuildLoop, AdoptSection, SpecBrowser, GetStarted, Footer
    the top bar scrolls away with the page; nothing on the page is fixed or sticky
    Scenario: one story, in order
      Given the page is open
      Then the level 1 heading reads "Write one sentence. Watch it become working software."
      And the level 2 headings read "Between a prompt and the code, there is nothing to review.", "A tree of tasks, the same all the way down", "Follow one sentence all the way down", "Watch AIL build, and adopt", "One spec, four readers", "How a spec becomes code you can trust", "Already have an app? Adopt it.", "Browse the specs" and "Start in two minutes", in that order
    Scenario: every top bar link has a place to land
      Given the page is open
      Then the page has elements with the ids "tree", "journey", "watch", "readers", "loop", "adopt", "specs" and "start"
  look
    page     a div: background color.page, color color.text, font.sans at font.body, line-height 1.6, min-height 100vh
    layout   [ TopBar, main, Footer ]
    main     a main element holding [ Hero, GapStrip, TreeSection, Journey, WatchSection, Readers, BuildLoop, AdoptSection, SpecBrowser, GetStarted ], with no gaps between them; each section brings its own padding
  uses      TopBar, Hero, GapStrip, TreeSection, Journey, WatchSection, Readers, BuildLoop, AdoptSection, SpecBrowser, GetStarted, Footer
  children  TopBar, Hero, GapStrip, TreeSection, Journey, WatchSection, Readers, BuildLoop, AdoptSection, SpecBrowser, GetStarted, Footer
```
