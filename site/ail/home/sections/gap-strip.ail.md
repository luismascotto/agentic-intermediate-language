# The gap

Why an intermediate language exists, in three cards.

```ail
node GapStrip : view   level: experience
  why   Before showing how AIL works, say what is missing without it.   <- HomePage
  what
    an eyebrow, a heading and three cards: a request is too vague, code is too detailed, and AIL is the layer in between
    the third card stands out and carries a reading tip
    the cards sit side by side when there is room and stack when there is not
    Scenario: three cards
      Given the page is open
      Then the section shows the text "THE PROBLEM" above the level 2 heading "Between a prompt and the code, there is nothing to review."
      And the level 3 headings in this section read "A prompt is too vague", "Code is too detailed" and "AIL is the layer in between", in that order
  look
    band      Section, tone raised
    heading   SectionHeading with eyebrow from gap.eyebrow, text from gap.heading
    cards     a div: display grid, grid-template-columns repeat(auto-fit, minmax(min(260px, 100%), 1fr)), gap space.4
    card      background color.surface, a 1px solid color.border border, radius.lg, pad clamp(16px, 4vw, 24px); stack(v, gap: space.3, align: start) [ icon, title, body ]
    third     the third card is dark like the code panels: background color.code, a 1px solid color.code border; its title color color.thread, its body color color.code.text, and a tip under its body in color color.code.muted
    title     an h3: font.lead, weight 700, line-height 1.3, color.text, margin 0
    body      a p: font.body, line-height 1.6, color.text.muted, margin 0
    tip       a p: font.small, weight 600, margin 0 (its color is set by third)
    icon      an aria-hidden svg, viewBox 0 0 40 40, width 40px, height 40px
    icon.1    a cloud: path "M12 30 H30 A7 7 0 0 0 30 16 A10 10 0 0 0 11 14 A8 8 0 0 0 12 30 Z", fill none, stroke color.text.muted, stroke-width 2
    icon.2    rect x 2 y 6 width 36 height 28 rx 4 fill color.code; three lines stroke color.code.text, stroke-width 2, stroke-linecap round: 8,14 to 28,14; 8,20 to 22,20; 8,26 to 32,26
    icon.3    four rects x 4 width 32 height 6 rx 3 at y 6, 14, 22 and 30, filled color.level.product, color.level.experience, color.level.system and color.level.specialist
  copy
    gap.eyebrow   "THE PROBLEM"
    gap.heading   "Between a prompt and the code, there is nothing to review."
    gap.1.title   "A prompt is too vague"
    gap.1.body    "Give two models the same prompt and you get two different apps, and nobody can say which one is right."
    gap.2.title   "Code is too detailed"
    gap.2.body    "Most people who decide what a product does can't read the code that decides it, and nobody reads all of it."
    gap.3.title   "AIL is the layer in between"
    gap.3.body    "A tree of plain sentences that gets more precise as you go down. People review it, models compile it one node at a time, and checks prove the result."
    gap.3.tip     "Read it from the top, and stop where the detail stops mattering to you."
  uses  Section, SectionHeading, Stack
```
