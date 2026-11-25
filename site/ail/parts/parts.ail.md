# Parts

The building blocks every section shares: one owner here, many users. Code
panels live in [`code.ail.md`](code.ail.md) and the small game board used by
the figures in [`mini-board.ail.md`](mini-board.ail.md).

```ail
node Parts : library   level: experience
  why   Every section is built from the same few pieces, so the page looks consistent from top to bottom.   <- AIL
  children  Stack, Section, SectionHeading, CodeBlock, CopyCommand, MiniBoard, SpecEditor
```

```ail
node Stack : view   level: experience
  why   Most of the page is a column or a row of parts with even spacing.   <- Parts
  what
    lays out its children in a column or a row, in the order given, with an even gap between them
    a row can wrap onto more lines when it runs out of room
    Scenario: children keep their order
      Given the children "a", "b" and "c"
      Then they appear in that order
  look
    box      a flex box: a column when dir is "v", a row when dir is "h"
    gap      the given token, as a CSS variable
    align    cross-axis alignment: start → flex-start, center → center, end → flex-end; stretch otherwise
    justify  main-axis alignment: start → flex-start, center → center, between → space-between; flex-start otherwise
    wrap     flex-wrap wrap when wrap is true; nowrap otherwise
    pad      the given token on all sides; no padding when none is given
  binds
    props    dir: "v" | "h", gap?: token name, align?: "start" | "center" | "end" | "stretch", justify?: "start" | "center" | "between", wrap?: boolean, pad?: token name, style?: extra inline style, children
    element  a div
```

```ail
node Section : view   level: experience
  why   Every band of the page has the same width, gutters and breathing room.   <- Parts
  what
    a full-width band with a centered content column; anchor links can land on it by its id
    Scenario: an anchored band
      Given the id "journey" and the child text "Hello"
      Then a region element with the id "journey" contains "Hello"
  look
    band     a section element, full width, box-sizing border-box; pad clamp(40px, 10vw, 64px) above and below, space.4 left and right
    tone     background color.surface when tone is "plain", color.surface.raised when tone is "raised"
    column   a div with max-width width.content, margin 0 auto, width 100%; stack(v, gap: space.8, align: stretch) [ children ]
    anchor   scroll-margin-top space.4 on the band
  binds
    props    id?: text, tone: "plain" | "raised", label?: text, children
    element  a section element with the given id and, when label is given, aria-label set to it
  uses  Stack
```

```ail
node SectionHeading : view   level: experience
  why   Every section opens the same way: an optional eyebrow, a heading, and one lead paragraph.   <- Parts
  what
    shows the eyebrow when given, the text as a level 2 heading, and the lead when given, in that order
    Scenario: a full heading
      Given the eyebrow "THE JOURNEY", the text "Follow one sentence all the way down" and the lead "Read on."
      Then a level 2 heading reads "Follow one sentence all the way down"
      And "THE JOURNEY" is shown above it and "Read on." below it
    Scenario: just a heading
      Given only the text "Start in two minutes"
      Then a level 2 heading reads "Start in two minutes" and nothing else is shown
  look
    layout   stack(v, gap: space.3, align: start) [ eyebrow, heading, lead ]
    eyebrow  a p: font.tiny, weight 700, letter-spacing 0.12em, color.accent, margin 0
    heading  an h2: font.display at font.heading, weight 700, line-height 1.1, letter-spacing -0.01em, color.text, margin 0
    lead     a p: font.lead, line-height 1.6, color.text.muted, max-width width.prose, margin 0
  binds
    props    text: text, eyebrow?: text, lead?: text
  uses  Stack
```
