# Hero

The first screen: what AIL is, in one breath, and the one sentence the rest of
the page follows.

```ail
node Hero : view   level: experience
  why   Say what AIL is before anything else, and set up the single sentence the page follows.   <- HomePage
  what
    an eyebrow, the page's only level 1 heading, a short explanation, three links and a note, beside a picture of the sentence sinking through the levels
    on a narrow screen the picture moves under the text
    Scenario: the links go to the right places
      Given the page is open
      Then "Follow the sentence ↓" leads to "#journey"
      And "Try to beat the computer ↓" leads to "#stop-8"
      And "View on GitHub ↗" leads to the repository
  look
    band      Section, tone plain
    grid      a div: display grid, grid-template-columns repeat(auto-fit, minmax(min(320px, 100%), 1fr)), gap space.8, align-items center
    text      stack(v, gap: space.4, align: start) [ eyebrow, headline, subhead, links, note ]
    eyebrow   a p: font.tiny, weight 700, letter-spacing 0.08em, color color.stop.text, background color.accent.soft, a 1px solid color.border border, radius.lg, pad space.1 space.3, margin 0
    headline  an h1: font.display at font.hero, weight 800, line-height 1.05, letter-spacing -0.02em, color.text, margin 0, max-width 16ch
    subhead   a p: font.lead, line-height 1.6, color.text.muted, max-width 52ch, margin 0
    links     stack(h, gap: space.3, align: center, wrap: true) [ follow, play, github ]
    follow    a link: background color.accent, color color.on.accent, a 2px solid color.accent border, radius.pill, pad space.3 space.6, weight 700, no underline, flex 1 1 auto, white-space nowrap, text-align center, box-sizing border-box (each fits its text on one line; on a phone each fills its own row)
    play      a link: background transparent, color color.text, a 2px solid color.text border, radius.pill, pad space.3 space.6, weight 700, no underline, flex 1 1 auto, white-space nowrap, text-align center, box-sizing border-box (each fits its text on one line; on a phone each fills its own row)
    github    a link: color color.text, weight 600, pad space.3 0, no underline
    note      a p: font.small, color.text.muted, margin 0
    picture   HeroFigure, centered in its column
  copy
    hero.eyebrow   "AIL, SAID LIKE THE ALE · A SPEC LANGUAGE FOR AI-BUILT SOFTWARE"
    hero.headline  "Write one sentence. Watch it become working software."
    hero.subhead   "Write what you want in plain words, then add detail level by level. AI agents build the code from it, checks prove it does what you wrote, and everyone on the team reviews the level written for them."
    hero.follow    "Follow the sentence ↓"
    hero.play      "Try to beat the computer ↓"
    hero.github    "View on GitHub ↗"
    hero.note      "This website is itself written in AIL and compiled by the same tool."
  binds
    follow   a link to "#journey"
    play     a link to "#stop-8"
    github   a link to "https://github.com/ffMathy/agentic-intermediate-language"
  uses      Section, Stack, HeroFigure
  children  HeroFigure
```

```ail
node HeroFigure : view   level: experience
  why   One picture that tells the whole story: a sentence goes down through four levels and comes out as code and a game.   <- Hero
  what
    a picture of a speech bubble saying "Tic-Tac-Toe." and then "The computer never loses.", four colored layers named Product, Experience, System and Specialist, a block of code and a small game board, joined by one yellow line
    the yellow line draws itself once, from the bubble down, when the page opens
    Scenario: the picture is described
      Given the page is open
      Then an image named "One sentence sinks through four levels of spec and comes out as code and a game board" is shown
      And it contains the texts "Tic-Tac-Toe.", "The computer never loses.", "Product", "Experience", "System" and "Specialist"
  look
    svg       viewBox 0 0 320 500, width 100%, max-width 340px, height auto, display block, margin 0 auto
    bubble    rect x 20 y 10 width 280 height 72 rx 12, fill color.surface, stroke color.border, stroke-width 1.5
    tail      drawn after the bubble, so no border line crosses where it joins: first path "M44 80 L40 94 L68 80 Z" fill color.surface, no stroke (it covers the bubble's border there); then path "M44 82 L40 94 L68 82", fill none, stroke color.border, stroke-width 1.5
    game      text at 160, 34, text-anchor middle, font-size 13, weight 600, fill color.text.muted
    saying    text at 160, 62, text-anchor middle, font.display, font-size 19, weight 700, fill color.text
    strata    four rects x 40 width 240 height 52 rx 8 at y 96, 154, 212 and 270, filled color.level.product, color.level.experience, color.level.system and color.level.specialist
    names     text at x 52, y = the stratum's y + 31, font-size 13, weight 600, fill color.on.accent
    readers   text at x 268, y = the stratum's y + 31, text-anchor end, font-size 12, fill color.on.accent, opacity 0.85
    arrow     line 28,104 to 28,312 and path "M23 304 L28 314 L33 304", stroke color.text.muted, stroke-width 1.5, fill none
    precise   text at 14, 209, rotated -90 around that point, text-anchor middle, dominant-baseline middle, font-size 12, fill color.text.muted
    thread    line 160,82 to 160,406, stroke color.thread, stroke-width 3, stroke-linecap round, stroke-dasharray 400, animation "ail-thread 2.4s ease-out 1 both"; drawn after the strata
    code      rect x 40 y 330 width 240 height 64 rx 8, fill color.code, drawn after the thread
    lines     three mono texts, font-size 12, fill color.code.text: line 1 at 54, 352; line 2 at 66, 368; line 3 at 54, 384
    board     MiniBoard at x 118, y 406, cell 28, marks "X___O____"
  copy
    hero.figure.label   "One sentence sinks through four levels of spec and comes out as code and a game board"
    hero.figure.game    "Tic-Tac-Toe."
    hero.figure.saying  "The computer never loses."
    hero.figure.1       "Product"
    hero.figure.2       "Experience"
    hero.figure.3       "System"
    hero.figure.4       "Specialist"
    hero.figure.1r      "anyone"
    hero.figure.2r      "design · QA"
    hero.figure.3r      "engineers"
    hero.figure.4r      "experts"
    hero.figure.precise "more precise"
    hero.figure.code.1  "export function choose("
    hero.figure.code.2  "board: Board, me: Mark = "O""
    hero.figure.code.3  "): number {"
  binds
    svg      role img with aria-label from hero.figure.label
  uses  MiniBoard
```
