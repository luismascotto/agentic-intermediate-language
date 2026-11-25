# Get started

```ail
node GetStarted : view   level: experience
  why   Turn interest into a first try, from wherever the visitor already works: Claude Code, Cursor, GitHub Copilot or a terminal.   <- HomePage
  what
    the section has the id "start", so the page can link to it
    four cards, "In Claude Code", then the two AgentCards ("In Cursor" and "In GitHub Copilot"), then "In a terminal", in that order, side by side when there is room
    every command has its own copy button
    the terminal card lists the three commands that make up the whole tool
    the terminal card says the commands run inside a project, meaning a folder with an ail.config.json, and ends with copyable steps to try the tic-tac-toe demo from this page
    under the cards, a note on keeping generated code out of pull request diffs while it stays committed, with the lines to copy
    under the note, two links point to what to read or try next: the Tic-Tac-Toe spec and the repository
    Scenario: in Claude Code
      Given the page is open
      Then the card "In Claude Code" shows the commands "/plugin marketplace add ffMathy/agentic-intermediate-language" and "/plugin install ail@agentic-intermediate-language", in that order
    Scenario: in a terminal
      Given the page is open
      Then the card "In a terminal" shows the command "bun add -g github:ffMathy/agentic-intermediate-language"
      And a table lists "ail build", "ail show [what]" and "ail adopt", in that order, each with what it does
      And after the table it says the commands run inside a folder with an ail.config.json
      And it shows the commands "git clone https://github.com/ffMathy/agentic-intermediate-language", "cd agentic-intermediate-language && bun install && bun link", "cd examples/tictactoe && bun install && ail build" and "ail show", in that order
    Scenario: what to do next
      Given the page is open
      Then the heading "Start in two minutes" is followed by the lead "Install it, then describe a feature in plain words. You get a spec you can review, and code that is checked against it."
      And under the cards, the link "Read the Tic-Tac-Toe spec" leads to the example's spec folder and the link "View on GitHub ↗" leads to the repository, in that order
  look
    band      Section with id "start", tone plain
    layout    stack(v, gap: space.6, align: stretch) [ head, cards, ReviewNote, next ]
    head      SectionHeading with text from start.heading, lead from start.lead
    cards     a div: display grid, grid-template-columns repeat(auto-fit, minmax(min(320px, 100%), 1fr)), gap space.6, align-items start; holding [ claude card, AgentCards, cli card ]
    card      background color.surface, a 1px solid color.border border, radius.lg, pad clamp(16px, 4vw, 24px), min-width 0; stack(v, gap: space.3, align: stretch)
    title     an h3: font.lead, weight 700, color.text, margin 0
    subtitle  a p: font.small, color.text.muted, margin 0
    commands  one CopyCommand per command
    text      a p: font.body, line-height 1.6, color.text.muted, margin 0
    table     class "ail-wide" (shown only at 600px viewport width or more); width 100%, border-collapse collapse; every row has a 1px solid color.border bottom border; cells pad space.2 space.2 space.2 0, vertical-align top, font.small, text-align left
    command   the first cell in font.mono at font.code, weight 600, color.accent, white-space nowrap
    list      a ul with class "ail-narrow" (shown only below 600px viewport width): list-style none, margin 0, pad 0; one li per row of the table, in the same order, with pad space.2 0 and a 1px solid color.border bottom border; in it the command as a p in font.mono at font.code, weight 600, color.accent, margin 0, then its description as a p in font.small, line-height 1.5, color.text, margin space.1 0 0; the header row is not repeated
    closing   a p: font.small, weight 600, color.text, margin 0
    next      stack(h, gap: space.3, align: center, wrap: true) [ example, repo ]
    example   a link: background color.accent, color color.on.accent, a 2px solid color.accent border, radius.md, pad space.3 space.6, weight 700, no underline, flex 1 1 220px, max-width 360px, text-align center, box-sizing border-box
    repo      a link: background color.surface, color color.accent, a 2px solid color.accent border, radius.md, pad space.3 space.6, weight 700, no underline, flex 1 1 220px, max-width 360px, text-align center, box-sizing border-box
  copy
    start.heading          "Start in two minutes"
    start.lead             "Install it, then describe a feature in plain words. You get a spec you can review, and code that is checked against it."
    start.claude.title     "In Claude Code"
    start.claude.subtitle  "No API key. It runs on your Claude subscription."
    start.claude.1         "/plugin marketplace add ffMathy/agentic-intermediate-language"
    start.claude.2         "/plugin install ail@agentic-intermediate-language"
    start.claude.text      "Then ask for features in plain words. Claude changes the spec, and /ail:build compiles whatever changed."
    start.cli.title        "In a terminal"
    start.cli.subtitle     "Needs Bun 1.2 or later."
    start.cli.1            "bun add -g github:ffMathy/agentic-intermediate-language"
    start.cli.col.command  "Command"
    start.cli.col.does     "What it does"
    start.cli.build        "ail build"
    start.cli.build.does   "Compile whatever changed, then check everything: the spec, the code, every test, and each screen against its look."
    start.cli.show         "ail show [what]"
    start.cli.show.does    "The tree, one node, or what changed since a git ref."
    start.cli.adopt        "ail adopt"
    start.cli.adopt.does   "Does an existing app behave as its spec says? For bringing an app under AIL, and proving a rebuilt one behaves the same."
    start.cli.closing      "That's the whole tool: three commands."
    start.cli.where        "Run these inside a project, meaning any folder with an ail.config.json. To try the tic-tac-toe demo from this page:"
    start.cli.2            "git clone https://github.com/ffMathy/agentic-intermediate-language"
    start.cli.3            "cd agentic-intermediate-language && bun install && bun link"
    start.cli.4            "cd examples/tictactoe && bun install && ail build"
    start.cli.5            "ail show"
    start.example          "Read the Tic-Tac-Toe spec"
    start.repo             "View on GitHub ↗"
  binds
    claude   a card with an h3 from start.claude.title, the subtitle, CopyCommand with start.claude.1, CopyCommand with start.claude.2, then the text
    cli      a card with an h3 from start.cli.title, the subtitle, CopyCommand with start.cli.1, the table with a header row, then the narrow list of the same rows, the closing line, then a p from start.cli.where styled as text, CopyCommand with start.cli.2, CopyCommand with start.cli.3, CopyCommand with start.cli.4, CopyCommand with start.cli.5
    example  a link to "https://github.com/ffMathy/agentic-intermediate-language/tree/main/examples/tictactoe"
    repo     a link to "https://github.com/ffMathy/agentic-intermediate-language"
    cards    each card is a region named by its h3
  uses  Section, SectionHeading, Stack, CopyCommand, AgentCards, ReviewNote
  children  AgentCards, ReviewNote
```

```ail
node ReviewNote : view   level: experience
  why   Generated code is committed but not reviewed: show how to keep it out of pull request diffs.   <- GetStarted
  what
    a heading, why generated code is committed but collapsed in review, and the .gitattributes lines that do it
    Scenario: generated code stays out of review
      Given the note is shown
      Then the region named "Review the spec, not the generated code" shows the lines "src/gen/** linguist-generated=true" and "ail.lock.json linguist-generated=true"
  look
    note      a section element named by its h3 (aria-labelledby): background color.surface.raised, radius.lg, pad clamp(16px, 4vw, 24px), min-width 0; stack(v, gap: space.3, align: stretch) [ title, text, code ]
    title     an h3: font.lead, weight 700, color.text, margin 0
    text      a p: font.body, line-height 1.6, color.text.muted, max-width width.prose, margin 0
    code      CodeBlock with lines review.line.1 to review.line.3, label review.label
  copy
    review.title   "Review the spec, not the generated code"
    review.text    "Commit what ail build generates, so the app runs straight from the repository and CI can prove it was built from the spec. Then mark it as generated, and GitHub collapses it in every pull request diff: reviewers read the spec, the checks and the proof screenshots instead."
    review.label   ".gitattributes"
    review.line.1  "# .gitattributes, at the root of the repository"
    review.line.2  "src/gen/** linguist-generated=true"
    review.line.3  "ail.lock.json linguist-generated=true"
  uses  Stack, CodeBlock
```
