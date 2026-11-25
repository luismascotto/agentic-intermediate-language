# Code panels

Spec excerpts, generated code and commands are read and copied, so they are
shown exactly and stay legible on a phone.

```ail
node CodeBlock : view   level: experience
  why   Spec excerpts and code must be shown exactly, with the followed promise easy to spot.   <- Parts
  what
    shows the given lines exactly, one per line, keeping every space; an empty line stays an empty line
    is a region named with the given label, so screen readers can announce it
    long lines wrap inside the panel at every width, so every word and every highlight stays visible; nothing is cut off and the panel never scrolls sideways
    a wrapped line continues 4 characters further in than the first non-space character of its own line, so the indentation stays readable
    a line never breaks between its leading spaces and its first word, so no row is left with only spaces on it
    every occurrence of each highlight phrase is marked, in every line
    a caption, when given, is shown under the block
    Scenario: shown exactly
      Given the lines "a  b" and "  c" and the label "Sample"
      Then the region named "Sample" shows exactly those two lines, each on its own line, with its spaces kept
    Scenario: the thread is marked
      Given the lines "4. The computer never loses." and "5. New game" and the highlight "never loses"
      Then exactly one marked piece of text is shown, and it reads "never loses"
    Scenario: a caption
      Given the caption "examples/tictactoe/tictactoe.ail.md"
      Then that text is shown under the block
    Scenario: a long line wraps under itself
      Given the line "    because an instant answer feels like the player's own move did nothing" shown 30 characters wide
      Then the region does not scroll sideways and no text is hidden
      And the wrapped part starts 8 characters from the left edge, 4 further in than the word "because"
  look
    layout   stack(v, gap: space.2, align: stretch) [ block, caption ]
    block    a pre element: background color.code, text color.code.text, font.mono at font.code, line-height 1.6, pad clamp(12px, 3vw, 16px), radius.md, margin 0, white-space pre-wrap, overflow-wrap anywhere
    line     each line is a span with display block; for a line that starts with n spaces: padding-left (n + 4)ch and text-indent -(n + 4)ch, so its first row starts at the left edge and its wrapped rows start 4ch further in than its first non-space character; an empty line is a span holding one space, so it keeps its height; the leading spaces and the first word of every line are together in one span with word-break break-all, so a first word too long for the row is broken on the first row and never leaves that row empty
    edge     when edge is given, a 4px solid left border in that color token
    mark     a mark element: background color.thread.soft, color color.thread, a 1px solid color.thread bottom border, pad 0 2px, radius 2px
    caption  font.mono at font.tiny, color.text.muted, overflow-wrap anywhere
  binds
    props    lines: list of text, label: text, edge?: token name, highlight?: list of text, caption?: text
    element  the pre has role region and aria-label set to label; each line is its own block span inside it (see look.line), with no line-break characters between the spans
    marked   each marked occurrence is a mark element whose text is exactly the highlight phrase, so a reader, a screen reader or a check can find it
  uses  Stack
```

```ail
node CopyCommand : flow   level: experience
  why   Install commands get copied, so one press should copy them exactly.   <- Parts
  what
    shows one command on a dark row with a "Copy" button at its right end
    the whole command is always visible: a command too long for the row wraps onto further lines, breaking at spaces first and inside a word only when needed; it is never cut off or hidden behind a scroll
    the copied text is still the exact single-line command
    pressing "Copy" puts exactly the command on the clipboard; once that succeeds the button reads "Copied" for 1.5 seconds, then "Copy" again
    when the clipboard can't be written, the button keeps reading "Copy"
    Scenario: copying
      Given the command "ail build" and a working clipboard
      When the visitor presses the button named "Copy ail build"
      Then the clipboard holds "ail build"
      And the button reads "Copied"
      When 1500 ms pass
      Then the button reads "Copy" again
  look
    row      stack(h, gap: space.3, align: center, justify: between) with background color.code, radius.md, pad space.3, min-width 0
    command  a code element: font.mono at font.code, line-height 1.5, color.code.text, white-space pre-wrap, overflow-wrap anywhere, flex 1 1 auto, min-width 0
    button   font.sans at font.tiny, weight 600, color color.code.text, background transparent, a 1px solid color.code.border border, radius.sm, pad space.2 space.3, min-height 44px, cursor pointer, flex 0 0 auto
  copy
    copy.idle   "Copy"
    copy.done   "Copied"
    copy.name   "Copy {command}"
  binds
    props    command: text
    state    copied: boolean, starting at false
    press    navigator.clipboard.writeText(command); when it resolves, set copied to true; when it rejects or navigator.clipboard is missing, do nothing
    timer    while copied is true: after 1500 ms set copied to false; clear the timer in the effect's cleanup
    button   a native button with type "button" and aria-label from copy.name; its text is copy.done while copied, copy.idle otherwise
  uses  Stack
```
