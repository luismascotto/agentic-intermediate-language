# The adopt walkthrough

A team has an old Tic-Tac-Toe web app with no spec. Someone opens a new AIL
project folder, `tictactoe-ail/`, next to it in Claude Code and asks
`/ail:adopt` to bring its play screen under AIL, prove that the spec describes
the app, and then rebuild it on a new stack. Every output line is a real
format of the tools; the old app, its folder, its start command and its
`api` service are made up for the story. The screenshots are the demo's own,
committed with its checks.

```ail
node AdoptWalkthrough : data   level: system
  why   Show how an existing app comes under AIL, chapter by chapter, from the first request to the proof and a new stack.   <- WalkthroughPlayer
  what
    ADOPT: Walkthrough = { command: "/ail:adopt ../legacy-tictactoe \"the play screen\"", place: "Claude Code · tictactoe-ail/", picture: "tictactoe-ail/ spec, written node by node", rest: "unwritten", beats: the five beats of ADOPT_FIRST_HALF, then the five of ADOPT_SECOND_HALF, in their order }
    examples
      ADOPT.beats.length => 10
      totalSeconds(ADOPT) => 98
      clock(totalSeconds(ADOPT)) => "1:38"
      chapterStart(ADOPT, 3) => 26
      ADOPT.beats[0].title => "An old app, no spec"
      stateOf(ADOPT, 0, "PlayAGame") => "slice"
      stateOf(ADOPT, 0, "App") => "unwritten"
      stateOf(ADOPT, 7, "App") => "adopted"
      stateOf(ADOPT, 7, "BoardView") => "proven"
      stateOf(ADOPT, 9, "Rules") => "fresh"
      statesIn(ADOPT) => ["fresh", "writing", "checking", "unwritten", "slice", "written", "adopted", "proven"]
  how
    decide the terminal never shows the open question's reason in full
      because the site's own spec would then carry that marker, and every build of the site would list it as an open question of its own
      rejected quoting it verbatim because the warning would be false: the site has no unconfirmed reason
  uses      Walkthrough, AdoptFirstHalf, AdoptSecondHalf
  children  AdoptFirstHalf, AdoptSecondHalf
```

```ail
node AdoptFirstHalf : data   level: system
  why   The first five chapters of the adopt walkthrough: from the request to the how, written from the code.   <- AdoptWalkthrough
  what
    ADOPT_FIRST_HALF: list of Beat = [
        { id: "ask", seconds: 6, branch: false, title: "An old app, no spec",
          caption: "The app works, but nobody wrote down what it does or why. You point /ail:adopt at its code and name one slice to start with, never the whole app.",
          lines: ["> /ail:adopt ../legacy-tictactoe \"the play screen\""],
          states: { "PlayAGame": "slice" },
          inset: { kind: "shot", node: "PlayAGame", test: "X always starts", label: "Your app today · localhost:3000" } },
        { id: "run-legacy", seconds: 11, branch: false, title: "Find out how it starts",
          caption: "The agent works out how the app starts from its README, scripts, compose files and CI, and writes run.legacy. Services start first; each test makes its own data through the app.",
          lines: [
            "  \"legacy\": {",
            "    \"cwd\": \"../legacy-tictactoe\",",
            "    \"start\": \"npm start\",",
            "    \"ready\": \"http://localhost:3000\",",
            "    \"env\": { \"AIL_APP_URL\": \"http://localhost:3000\" },",
            "    \"services\": { \"api\": { \"cwd\": \"../legacy-tictactoe\", \"start\": \"npm run api\", \"ready\": \"http://localhost:3001/health\", \"env\": { \"AIL_API_URL\": \"http://localhost:3001\" } } },",
            "    \"seed\": \"bun ../tictactoe-ail/checks/e2e/data.ts seed\"",
            "  }"],
          states: { "PlayAGame": "slice" },
          inset: { kind: "card", label: "Started in this order", lines: ["service: api, ready when /health answers", "the app, ready when :3000 answers", "each test makes its own data through the app", "seed: only what every test needs", "never straight into the database"] } },
        { id: "why", seconds: 9, branch: false, title: "Why, from people and tickets",
          caption: "The reasons come from tickets, PRs, commit messages, and questions the agent asks you as if you owned the app. A reason nobody can confirm is written as unknown, never made up.",
          lines: ["  why   Make the game understandable without instructions.   <- App", "  how", "    decide the computer answers after 300 ms"],
          states: { "PlayAGame": "writing", "App": "writing" },
          inset: { kind: "card", label: "Where the reasons come from", lines: ["tickets", "PRs", "commits", "your answers", "? nobody could confirm why 300 ms, so its reason is written as unknown"] } },
        { id: "what", seconds: 10, branch: false, title: "What, from the running app",
          caption: "The agent plays the app with Playwright. What it sees becomes scenarios with the exact on-screen text, quirks included. Text a part owns, like a button's label, goes in its node.",
          lines: [
            "node PlayAGame : flow   level: experience",
            "  what",
            "    Scenario: winning",
            "      Given X has the top-left and top-middle squares, O has the center and bottom-left squares, and it is X's turn",
            "      When X picks the top-right square",
            "      Then the status says \"X wins!\"",
            "      And the top row is highlighted"],
          states: { "PlayAGame": "writing", "App": "written", "NewGameButton": "writing", "StatusLine": "writing", "BoardView": "writing", "ChooseOpponent": "writing" },
          inset: { kind: "shot", node: "PlayAGame", test: "winning", label: "Your app today · localhost:3000" } },
        { id: "how", seconds: 9, branch: false, title: "How, from the code",
          caption: "The code tells what the screen can't: data shapes, rules, edge cases and timing. Written in AIL, not the old language, it compiles to any stack. Each node lists its sources.",
          lines: [
            "  how",
            "    decide squares can't be picked while the computer is thinking",
            "      because otherwise a quick second tap would play the computer's turn",
            "  sources",
            "    ticket, interview (who, when), screen, code path"],
          states: { "PlayAGame": "writing", "App": "written", "NewGameButton": "written", "StatusLine": "written", "BoardView": "written", "ChooseOpponent": "written", "GameReducer": "writing", "Rules": "writing", "GameState": "writing" },
          inset: { kind: "card", label: "From the code, into AIL", lines: ["timer constant → decide the computer answers after 300 ms", "lock flag → decide squares can't be picked while the computer is thinking", "interface → type Name = { … }", "null → nothing"] } }
      ]
    examples
      ADOPT_FIRST_HALF.length => 5
      ADOPT_FIRST_HALF[1].id => "run-legacy"
      ADOPT_FIRST_HALF[1].lines.length => 8
  uses  Walkthrough
```

```ail
node AdoptSecondHalf : data   level: system
  why   The last five chapters of the adopt walkthrough: from the end-to-end check to the new stack.   <- AdoptWalkthrough
  what
    ADOPT_SECOND_HALF: list of Beat = [
        { id: "checks", seconds: 8, branch: false, title: "A check for every scenario",
          caption: "Each flow gets an end-to-end check: one test per scenario, only what a user can see and do, so it works on the rebuilt app. Tests end with screenshots.",
          lines: [
            "checks/e2e/app/play/play-a-game.e2e.ts",
            "test(\"X always starts\", async () => {",
            "  await expect(status(\"X's turn\").isVisible()).resolves.toBe(true);",
            "  await proof(\"X always starts\");",
            "});",
            "→ x-always-starts.png"],
          states: { "PlayAGame": "writing", "App": "written", "NewGameButton": "written", "StatusLine": "written", "BoardView": "written", "ChooseOpponent": "written", "GameReducer": "written", "Rules": "written", "GameState": "written" },
          inset: { kind: "card", label: "One screenshot per test", lines: ["→ x-always-starts.png", "→ taking-turns.png", "→ a-taken-square-can-t-be-picked.png", "→ winning.png", "→ draw.png", "→ new-game.png", "→ the-computer-answers.png"] } },
        { id: "prove", seconds: 11, branch: false, title: "Prove it on the old app",
          caption: "ail_adopt starts and seeds the old app and its API, runs each check, then stops everything. A failing check means the spec or the check is wrong, never the app.",
          lines: ["· starting the service api: npm run api", "· starting the app: npm start", "· seeding through the app: bun ../tictactoe-ail/checks/e2e/data.ts seed"],
          states: { "PlayAGame": "checking", "App": "written", "NewGameButton": "written", "StatusLine": "written", "BoardView": "written", "ChooseOpponent": "written", "GameReducer": "written", "Rules": "written", "GameState": "written" },
          inset: { kind: "card", label: "Run from outside the project", lines: ["// ail-derived-from: PlayAGame@5445e0669a18e44c", "a temp folder gets only AIL_APP_URL, AIL_API_URL and AIL_SHOTS_DIR", "✓ 7 tests, 7 screenshots in checks/shots/e2e/app/play/play-a-game/", "everything stops, the app first"] } },
        { id: "judge", seconds: 12, branch: false, title: "A model checks the look",
          caption: "One model call judges all the flow's screenshots together. Once everything has passed, every node ail hasn't built is recorded in the lock as built by the existing app.",
          lines: [
            "· PlayAGame: comparing its screenshots with its look",
            "✓ app      1 of 1 flow(s) behave as their spec says (run.legacy)",
            "    · 2 node(s) with scenarios have no end-to-end check yet: App, WatchADemo",
            "    ✓ PlayAGame: 7 screenshot(s) match its look",
            "    ✓ recorded 16 node(s) as built by the existing app in the lock file, so ail build only builds what changes from now on",
            "    · to keep generated code out of pull request diffs (it stays committed, and GitHub collapses it), add to /…/tictactoe-ail/.gitattributes:",
            "        src/gen/** linguist-generated=true",
            "        ail.lock.json linguist-generated=true"],
          states: { "TicTacToe": "adopted", "App": "adopted", "WatchADemo": "adopted", "GameState": "adopted", "Rules": "adopted",
            "PlayAGame": "proven", "ChooseOpponent": "proven", "NewGameButton": "proven", "StatusLine": "proven", "BoardView": "proven", "GameReducer": "proven", "ComputerPlayer": "proven", "Stack": "proven", "Text": "proven", "Button": "proven", "Segmented": "proven" },
          inset: { kind: "shot", node: "PlayAGame", test: "draw", label: "7 screenshots, one verdict", verdict: "MATCHES" } },
        { id: "report", seconds: 8, branch: false, title: "Report, questions and review",
          caption: "Claude reports the nodes it wrote, what ail_adopt said and each open question with who could answer it, and asks before adding .gitattributes. Every build lists the question until answered.",
          lines: ["✓ spec     no errors, 1 warning(s)"],
          states: { "TicTacToe": "adopted", "App": "adopted", "WatchADemo": "adopted", "GameState": "adopted", "Rules": "adopted",
            "PlayAGame": "proven", "ChooseOpponent": "proven", "NewGameButton": "proven", "StatusLine": "proven", "BoardView": "proven", "GameReducer": "proven", "ComputerPlayer": "proven", "Stack": "proven", "Text": "proven", "Button": "proven", "Segmented": "proven" },
          inset: { kind: "card", label: "The next ail build", lines: ["! open-question: PlayAGame has a reason nobody has confirmed yet", "ask: the product owner", "add the .gitattributes lines? yes"] } },
        { id: "migrate", seconds: 14, branch: false, title: "Move to a new stack",
          caption: "Change the target and run /ail:build. The build hash includes the target, the checks' pin does not: every node is rebuilt, and the same checks prove the new app.",
          lines: [
            "· PlayAGame: deriving checks from its scenarios",
            "· PlayAGame: attempt 1 with claude-code",
            "✓ PlayAGame          compiled",
            "! app      end-to-end checks not run: ail.config.json has no run.app saying how to start the app this project builds",
            "\"app\": { \"start\": \"bun --port=4173 ./index.html\", \"ready\": \"http://localhost:4173\", \"env\": { \"AIL_APP_URL\": \"http://localhost:4173\" } }",
            "· starting the app: bun --port=4173 ./index.html",
            "✓ app      1 of 1 flow(s) behave as their spec says (run.app)",
            "    ✓ PlayAGame: 7 screenshot(s) match its look"],
          states: { "TicTacToe": "fresh", "App": "fresh", "PlayAGame": "fresh", "WatchADemo": "fresh", "ChooseOpponent": "fresh", "NewGameButton": "fresh", "Stack": "fresh", "Text": "fresh",
            "Button": "fresh", "Segmented": "fresh", "BoardView": "fresh", "StatusLine": "fresh", "GameState": "fresh", "Rules": "fresh", "GameReducer": "fresh", "ComputerPlayer": "fresh" },
          inset: { kind: "shot", node: "PlayAGame", test: "new game", label: "Your app, rebuilt · localhost:4173", verdict: "MATCHES" } }
      ]
    examples
      ADOPT_SECOND_HALF.length => 5
      ADOPT_SECOND_HALF[2].id => "judge"
      ADOPT_SECOND_HALF[2].lines.length => 8
  uses  Walkthrough
```
