# Footer

```ail
node Footer : view   level: experience
  why   Close the page by restating that everything on it was built the way it describes, and point to the deeper material.   <- HomePage
  what
    a strip of the four level colors, one sentence on where this page and the game came from, and seven links
    Scenario: the links
      Given the page is open
      Then "GitHub" leads to the repository, "Design proposal" to the design document, "Language definition" to the definition of AIL, "Claude Code guide" to the Claude Code guide, "Cursor guide" to the Cursor guide, "Copilot guide" to the GitHub Copilot guide and "This site's spec" to the site's spec folder
  look
    bar       a footer element: background color.code, color color.code.muted, font.small
    strip     a div at the top, height 4px, display flex; four equal children with flex 1, colored color.level.product, color.level.experience, color.level.system and color.level.specialist
    inner     a div with max-width width.content, margin 0 auto, box-sizing content-box, pad clamp(24px, 6vw, 32px) space.4 (the space.4 side padding sits outside the width, so the content box is at most width.content wide); stack(v, gap: space.4, align: start) [ text, links ]
    text      a p: line-height 1.6, max-width width.prose, margin 0
    links     a nav element: display flex, flex-wrap wrap, align-items center, column-gap space.4, row-gap 0 [ github, proposal, language, guide, cursor, copilot, spec ]
    link      a link: display inline-flex, align-items center, min-height 44px, color color.code.text, weight 600, underline
  copy
    footer.text      "Brewed in AIL. This page was compiled from the spec in site/ail/, and the game from the spec in examples/tictactoe/ail/. Apart from the spec and a short index.html, nothing in either was written by hand."
    footer.nav       "More about AIL"
    footer.github    "GitHub"
    footer.proposal  "Design proposal"
    footer.language  "Language definition"
    footer.guide     "Claude Code guide"
    footer.cursor    "Cursor guide"
    footer.copilot   "Copilot guide"
    footer.spec      "This site's spec"
  binds
    links     aria-label from footer.nav
    github    a link to "https://github.com/ffMathy/agentic-intermediate-language"
    proposal  a link to "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/proposal.md"
    language  a link to "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/language.md"
    guide     a link to "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/claude-code.md"
    cursor    a link to "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/cursor.md"
    copilot   a link to "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/copilot.md"
    spec      a link to "https://github.com/ffMathy/agentic-intermediate-language/tree/main/site"
  uses  Stack
```
