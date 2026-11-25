# Spec browser

Both example specs, browsable like code. The files are not copied into the
spec by hand: `ail build` writes them into a data module (the `specModule`
in ail.config.json), so the browser always shows the current specs, including
the one that describes this browser.

```ail
node SpecBrowser : flow   level: experience
  why   Reading real specs is the fastest way to learn AIL, so both example specs can be browsed the way developers read code.   <- HomePage
  what
    the section has the id "specs", so the page can link to it
    two projects can be browsed: the Tic-Tac-Toe demo and this website; the demo is shown first
    for the shown project: how big its spec is (counted from the spec itself: how many nodes, in how many files), its spec files grouped by folder, and the picked file in a read-only editor
    at first the demo's root file is picked: the top of its spec; showing another project picks its first file
    a link anywhere on the page can open a file here: when the page address ends with "#spec/", a project's key, "/" and one of its file paths, that project and file are shown and this section scrolls into view
    following such a link again works too, even when the page address already ends with it
    below 600px viewport width the file list is a drop-down of the same files, so the editor follows straight after it, and the size line is left out
    under the browser, one line points to the language definition, which says what every part of a spec means
    Scenario: the demo's spec is shown first
      Given the page is open
      Then the project "Tic-Tac-Toe demo" is shown as picked
      And the file "tictactoe.ail.md" is shown as picked
      And the region named "Source of tictactoe.ail.md" contains "node TicTacToe : system"
    Scenario: picking another file
      Given the page is open
      When the visitor picks the file "board/board.ail.md"
      Then "board/board.ail.md" is shown as picked and "tictactoe.ail.md" is not
      And the region named "Source of board/board.ail.md" contains "node BoardView : view"
    Scenario: showing this website's spec
      Given the page is open
      When the visitor picks the project "This website"
      Then that project is shown as picked and its first file is picked
      And the size line reads the website's number of nodes and of files
    Scenario: opened from a link
      Given the page address ends with "#spec/tictactoe/app/play/play.ail.md"
      When the page opens
      Then the project "Tic-Tac-Toe demo" and the file "app/play/play.ail.md" are shown as picked
    Scenario: the language is defined
      Given the page is open
      Then the section with the id "specs" has a link "the language definition" that leads to the language definition
    Scenario: following the same link twice
      Given the page address ends with "#spec/tictactoe/app/play/play.ail.md" and the page is open
      When the visitor picks the file "tictactoe.ail.md"
      And the visitor clicks a link on the page to "#spec/tictactoe/app/play/play.ail.md"
      Then the file "app/play/play.ail.md" is shown as picked again
  look
    band      Section with id "specs", tone raised
    layout    stack(v, gap: space.6, align: stretch) [ head, window, language ]
    head      SectionHeading with eyebrow from browse.eyebrow, text from browse.heading, lead from browse.lead
    window    a div: radius.lg, overflow hidden, a 1px solid color.code.border border, background color.code, box-shadow 0 12px 32px rgba(15, 23, 42, 0.18)
    titlebar  a div: display flex, flex-wrap wrap, align-items center, gap space.3, pad space.1 space.3, background color.code.bar, a 1px solid color.code.border bottom border; holding [ dots, projects, size ]
    dots      an aria-hidden div with three 10px circles 6px apart: color.dot.red, color.dot.amber, color.dot.green
    projects  a div with role group named by browse.projects: display flex, gap space.1; one project button per project
    project   a button with type "button": font.small, weight 600, min-height 44px, pad space.1 space.3, radius.md, border none, background transparent, color color.code.muted, cursor pointer; the picked one instead has background color.code.pick and color color.code.text
    size      a p with class "ail-wide": margin 0 0 0 auto, font.mono at font.tiny, color color.code.muted
    body      a div: display flex, flex-wrap wrap
    explorer  a nav with class "ail-wide" named by browse.files: flex 1 1 220px, max-height clamp(200px, 40vw, 560px), overflow-y auto, background color.code.side, pad space.2 0, box-sizing border-box
    picker    a select with class "ail-narrow" named by browse.files, placed in the body before the explorer: width 100%, min-height 44px, box-sizing border-box, font.mono at font.small, color color.code.text, background color.code.side, border none, a 1px solid color.code.border bottom border, pad space.2 space.3
    folder    a div: font.mono at font.tiny, color color.code.muted, pad space.1 space.3, padding-left calc(space.3 + 12px × (depth − 1)), where depth counts the "/" in the folder path plus one
    file      a button with type "button": display block, width 100%, text-align left, font.mono at font.tiny, color color.code.text, background transparent, border none, a 2px solid transparent left border, pad space.1 space.3, padding-left calc(space.3 + 12px × depth), where depth counts the "/" in the path, cursor pointer; the picked one instead has background color.code.pick and a 2px solid color.accent left border
    editor    a div: flex 999 1 420px, min-width 0, max-width 100%, overflow hidden, height clamp(380px, 120vw, 560px); holding SpecEditor
    language  a p: margin 0, font.body, line-height 1.6, color.text.muted, max-width width.prose; the text browse.language.before, then the link, then browse.language.after; the link: color color.accent, weight 600, underline
  copy
    browse.eyebrow    "Dogfooding"
    browse.heading    "Browse the specs"
    browse.lead       "Read both example specs the way you read code: the Tic-Tac-Toe demo, and this website itself, which is written in AIL and compiled by ail build too. The files come straight from the specs at build time, so they are always current."
    browse.size       "{nodes} nodes in {files} files"
    browse.projects   "Projects"
    browse.files      "Spec files"
    browse.source     "Source of {path}"
    browse.language.before  "Every section, the notation for types and values, and the rules ail build enforces are in "
    browse.language.link    "the language definition"
    browse.language.after   ". A spec never uses a programming language's syntax: each compiler translates it into its target's own conventions."
  binds
    data      specProjects from the spec module, in this order: "tictactoe" (the demo), then "site" (this website)
    state     project: text, the shown project's key, starting at "tictactoe"; file: text, the picked file's path, starting at "tictactoe.ail.md"
    language  the link leads to "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/language.md"
    hash      open(hash): when hash starts with "#spec/", the rest up to its first "/" is a project key and the remainder a file path; if that project has that file, show both and scroll the section element into view
    links     call open(location.hash) on mount and on every hashchange event of window; also listen for click events on document, and when the click's target is inside an a element whose href attribute starts with "#spec/", call open with that attribute (a link equal to the current address fires no hashchange); remove both listeners on unmount
    project   one button per entry of specProjects, in order, showing its name; aria-pressed true on the shown one; pressing another one shows it and picks its first file
    size      nodes is the shown project's nodeCount, files the number of its files
    list      the shown project's files in their order; before a file whose folder (its path up to the last "/") differs from the previous file's folder, a folder row showing that folder followed by "/"; files at the top level have no folder row
    file      shows the file name (the path after its last "/"); its accessible name and title are the full path; aria-pressed true on the picked one; pressing it picks that path
    picker    one option per file of the shown project, in file order, each showing its full path and having it as its value; consecutive files in the same folder share one optgroup labelled with that folder followed by "/", and top-level files are options outside any optgroup; its value is the picked path, and changing it picks that path
    editor    SpecEditor with text = the picked file's text, path = the shown project's key + "/" + the picked path, label = browse.source with {path} filled in with the picked path
  uses  Section, SectionHeading, SpecEditor, Stack
```
