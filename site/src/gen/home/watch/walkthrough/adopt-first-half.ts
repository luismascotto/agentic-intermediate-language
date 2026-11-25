import type { Beat } from "./walkthrough";

/** ADOPT_FIRST_HALF: list of Beat — the first five chapters of the adopt walkthrough: from the request to the how, written from the code. */
export const ADOPT_FIRST_HALF: Beat[] = [
  {
    id: "ask",
    seconds: 6,
    branch: false,
    title: "An old app, no spec",
    caption:
      "The app works, but nobody wrote down what it does or why. You point /ail:adopt at its code and name one slice to start with, never the whole app.",
    lines: ["> /ail:adopt ../legacy-tictactoe \"the play screen\""],
    states: { PlayAGame: "slice" },
    inset: {
      kind: "shot",
      node: "PlayAGame",
      test: "X always starts",
      label: "Your app today · localhost:3000",
    },
  },
  {
    id: "run-legacy",
    seconds: 11,
    branch: false,
    title: "Find out how it starts",
    caption:
      "The agent works out how the app starts from its README, scripts, compose files and CI, and writes run.legacy. Services start first; each test makes its own data through the app.",
    lines: [
      "  \"legacy\": {",
      "    \"cwd\": \"../legacy-tictactoe\",",
      "    \"start\": \"npm start\",",
      "    \"ready\": \"http://localhost:3000\",",
      "    \"env\": { \"AIL_APP_URL\": \"http://localhost:3000\" },",
      "    \"services\": { \"api\": { \"cwd\": \"../legacy-tictactoe\", \"start\": \"npm run api\", \"ready\": \"http://localhost:3001/health\", \"env\": { \"AIL_API_URL\": \"http://localhost:3001\" } } },",
      "    \"seed\": \"bun ../tictactoe-ail/checks/e2e/data.ts seed\"",
      "  }",
    ],
    states: { PlayAGame: "slice" },
    inset: {
      kind: "card",
      label: "Started in this order",
      lines: [
        "service: api, ready when /health answers",
        "the app, ready when :3000 answers",
        "each test makes its own data through the app",
        "seed: only what every test needs",
        "never straight into the database",
      ],
    },
  },
  {
    id: "why",
    seconds: 9,
    branch: false,
    title: "Why, from people and tickets",
    caption:
      "The reasons come from tickets, PRs, commit messages, and questions the agent asks you as if you owned the app. A reason nobody can confirm is written as unknown, never made up.",
    lines: [
      "  why   Make the game understandable without instructions.   <- App",
      "  how",
      "    decide the computer answers after 300 ms",
    ],
    states: { PlayAGame: "writing", App: "writing" },
    inset: {
      kind: "card",
      label: "Where the reasons come from",
      lines: [
        "tickets",
        "PRs",
        "commits",
        "your answers",
        "? nobody could confirm why 300 ms, so its reason is written as unknown",
      ],
    },
  },
  {
    id: "what",
    seconds: 10,
    branch: false,
    title: "What, from the running app",
    caption:
      "The agent plays the app with Playwright. What it sees becomes scenarios with the exact on-screen text, quirks included. Text a part owns, like a button's label, goes in its node.",
    lines: [
      "node PlayAGame : flow   level: experience",
      "  what",
      "    Scenario: winning",
      "      Given X has the top-left and top-middle squares, O has the center and bottom-left squares, and it is X's turn",
      "      When X picks the top-right square",
      "      Then the status says \"X wins!\"",
      "      And the top row is highlighted",
    ],
    states: {
      PlayAGame: "writing",
      App: "written",
      NewGameButton: "writing",
      StatusLine: "writing",
      BoardView: "writing",
      ChooseOpponent: "writing",
    },
    inset: {
      kind: "shot",
      node: "PlayAGame",
      test: "winning",
      label: "Your app today · localhost:3000",
    },
  },
  {
    id: "how",
    seconds: 9,
    branch: false,
    title: "How, from the code",
    caption:
      "The code tells what the screen can't: data shapes, rules, edge cases and timing. Written in AIL, not the old language, it compiles to any stack. Each node lists its sources.",
    lines: [
      "  how",
      "    decide squares can't be picked while the computer is thinking",
      "      because otherwise a quick second tap would play the computer's turn",
      "  sources",
      "    ticket, interview (who, when), screen, code path",
    ],
    states: {
      PlayAGame: "writing",
      App: "written",
      NewGameButton: "written",
      StatusLine: "written",
      BoardView: "written",
      ChooseOpponent: "written",
      GameReducer: "writing",
      Rules: "writing",
      GameState: "writing",
    },
    inset: {
      kind: "card",
      label: "From the code, into AIL",
      lines: [
        "timer constant → decide the computer answers after 300 ms",
        "lock flag → decide squares can't be picked while the computer is thinking",
        "interface → type Name = { … }",
        "null → nothing",
      ],
    },
  },
];
