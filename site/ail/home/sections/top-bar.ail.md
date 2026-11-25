# Top bar

```ail
node TopBar : view   level: experience
  why   Visitors should always know where they are and reach the main parts of the page in one click.   <- HomePage
  what
    the name of the project on the left, and eight links on the right
    when there is not enough room, the links go under the name, in one row that scrolls sideways
    Scenario: the links lead to the right places
      Given the page is open
      Then the navigation named "Sections" has the links "The journey", "Watch it work", "Four readers", "How it builds", "Adopt an app", "Browse the specs", "Get started" and "GitHub ↗", in that order
      And they lead to "#journey", "#watch", "#readers", "#loop", "#adopt", "#specs", "#start" and the repository
  look
    bar       a header element: full width, background color.surface, a 1px solid color.border bottom border, box-sizing border-box, pad space.2 space.4
    row       inside, a div with max-width width.content, margin 0 auto; stack(h, gap: space.2, align: center, justify: between, wrap: true) [ brand, nav ]
    brand     stack(h, gap: space.2, align: center, wrap: true) [ glass, wordmark, name ]
    glass     a small beer glass beside the name: an aria-hidden svg, display block, viewBox 0 0 22 28, width 22px, height 28px: path "M3 4 H19 L17.5 26 H4.5 Z" fill color.level.experience, then path "M3 4 H19 L18.6 10 H3.4 Z" fill color.page, both stroke color.text, stroke-width 2, stroke-linejoin round
    wordmark  font.display at 24px, weight 800, color.text, letter-spacing -0.01em
    name      font.small, color.text.muted
    nav       a nav element: display flex, flex-wrap nowrap, align-items center, column-gap space.4, max-width 100%, overflow-x auto (on a phone the links are one row that scrolls sideways, instead of three rows of links before any content) [ links ]
    link      font.small, weight 600, color.text, no underline, display inline-flex, align-items center, min-height 44px, flex none, white-space nowrap
  copy
    bar.wordmark  "AIL"
    bar.name      "Agentic Intermediate Language"
    bar.nav       "Sections"
    bar.journey   "The journey"
    bar.watch     "Watch it work"
    bar.readers   "Four readers"
    bar.loop      "How it builds"
    bar.adopt     "Adopt an app"
    bar.self      "Browse the specs"
    bar.start     "Get started"
    bar.github    "GitHub ↗"
  binds
    nav      aria-label from bar.nav
    journey  a link to "#journey"
    watch    a link to "#watch"
    readers  a link to "#readers"
    loop     a link to "#loop"
    adopt    a link to "#adopt"
    self     a link to "#specs"
    start    a link to "#start"
    github   a link to "https://github.com/ffMathy/agentic-intermediate-language"
  uses  Stack
```
