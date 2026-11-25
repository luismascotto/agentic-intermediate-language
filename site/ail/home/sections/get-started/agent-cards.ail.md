# Cursor and GitHub Copilot

The same plugin runs in Cursor and in GitHub Copilot, so the visitor who
works there can start there too.

```ail
node AgentCards : view   level: experience
  why   Many visitors work in Cursor or GitHub Copilot, not Claude Code: show that the same plugin installs there.   <- GetStarted
  what
    two cards, "In Cursor" and "In GitHub Copilot", in that order; they are placed straight into GetStarted's grid of cards, next to its other cards, with no box of their own around them
    every command has its own copy button
    Scenario: in Cursor
      Given the page is open
      Then the card "In Cursor" shows the command "git clone https://github.com/ffMathy/agentic-intermediate-language ~/.cursor/plugins/local/ail"
      And it says to reload the window afterwards, and that teams can import the repository as a team marketplace instead
    Scenario: in GitHub Copilot
      Given the page is open
      Then the card "In GitHub Copilot" shows the commands "copilot plugin marketplace add ffMathy/agentic-intermediate-language" and "copilot plugin install ail@agentic-intermediate-language", in that order
      And it says VS Code installs it from the same marketplace
  look
    layout    a fragment, with no element of its own, holding [ cursor, copilot ]
    card      background color.surface, a 1px solid color.border border, radius.lg, pad clamp(16px, 4vw, 24px), min-width 0; stack(v, gap: space.3, align: stretch)
    title     an h3: font.lead, weight 700, color.text, margin 0
    subtitle  a p: font.small, color.text.muted, margin 0
    commands  one CopyCommand per command
    text      a p: font.body, line-height 1.6, color.text.muted, margin 0
  copy
    start.cursor.title     "In Cursor"
    start.cursor.subtitle  "No API key. Builds run on your Cursor subscription."
    start.cursor.1         "git clone https://github.com/ffMathy/agentic-intermediate-language ~/.cursor/plugins/local/ail"
    start.cursor.text      "Then run Developer: Reload Window. Teams can import the repository as a team marketplace instead. The same skill, commands and hooks as in Claude Code."
    start.copilot.title    "In GitHub Copilot"
    start.copilot.subtitle "No API key. Builds run on your Copilot subscription."
    start.copilot.1        "copilot plugin marketplace add ffMathy/agentic-intermediate-language"
    start.copilot.2        "copilot plugin install ail@agentic-intermediate-language"
    start.copilot.text     "That's the Copilot CLI. In VS Code, add the same repository under chat.plugins.marketplaces and install ail from Agent Customizations."
  binds
    cursor   a card with an h3 from start.cursor.title, the subtitle, CopyCommand with start.cursor.1, then the text
    copilot  a card with an h3 from start.copilot.title, the subtitle, CopyCommand with start.copilot.1, CopyCommand with start.copilot.2, then the text
    cards    each card is a region named by its h3
  uses  Stack, CopyCommand
```
