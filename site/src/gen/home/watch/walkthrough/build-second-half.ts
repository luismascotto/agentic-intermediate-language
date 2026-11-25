import type { Beat } from "./walkthrough";

/** BUILD_SECOND_HALF: list of Beat — the last five chapters of the build walkthrough: from the screens judged to the final report. */
export const BUILD_SECOND_HALF: Beat[] = [
  {
    id: "look",
    seconds: 10,
    branch: false,
    title: "Screens judged against the look",
    caption:
      "Tests prove behaviour, not looks. Each test's final screen is screenshotted, and a model compares it with the node's look and copy. A mismatch sends it back, like a failing test.",
    lines: [
      "· WatchADemo: 4 screen(s) match its look",
      "· App: attempt 1 with claude-code",
      "· App: 2 screen(s) match its look",
    ],
    states: { WatchADemo: "proven", App: "proven" },
    inset: {
      kind: "shot",
      node: "WatchADemo",
      test: "perfect play ends in a draw",
      label: "WatchADemo: 4 screens judged against its look",
      verdict: "MATCHES",
    },
  },
  {
    id: "stop",
    seconds: 8,
    branch: true,
    title: "Branch: the spec must decide",
    caption:
      "Suppose only what said 500 ms. The compiler won't pick a pace: it replies STOP with a question, its dependants wait, and the answer goes into the spec.",
    lines: [
      "? WatchADemo         stopped: `what` says one move every 500 ms, but `how` decides one move every 600 ms and `binds` waits 600 ms. Which pace is it?",
      "… App                skipped: waiting for WatchADemo",
      "",
      "✓ spec     no errors",
      "✗ build    2 output(s) not built from the current spec — run `ail build`",
      "✗ behavior 1 node(s) failed",
      "",
      "The spec doesn't decide the questions above. Answer them in the .ail.md files, then build again.",
    ],
    states: { WatchADemo: "stopped", App: "skipped" },
    inset: {
      kind: "card",
      label: "Branch: a what-if",
      lines: [
        "STOP: which pace is it?",
        "what says 500 ms; how and binds say 600 ms",
        "the answer goes into ail/app/demo/demo.ail.md",
        "never into src/gen",
        "… App waits for WatchADemo",
      ],
    },
  },
  {
    id: "lock",
    seconds: 7,
    branch: false,
    title: "Recorded in the lock",
    caption:
      "The lock records the new compile hash, a hash of the file, who built it, and its shots and look marks. An unchanged node with a matching look mark is a cache hit; a hand-edited file is rebuilt.",
    lines: [],
    states: {},
    inset: {
      kind: "card",
      label: "ail.lock.json",
      lines: [
        "\"WatchADemo\": {",
        "  \"hash\": \"<new 64-hex>\",",
        "  \"files\": { \"src/gen/app/demo/watch-a-demo.tsx\": \"<sha256>\" },",
        "  \"by\": \"claude-code\",",
        "  \"shots\": \"<same as hash>\",",
        "  \"look\": \"<same as hash>\"",
        "}",
      ],
    },
  },
  {
    id: "e2e",
    seconds: 9,
    branch: false,
    title: "Checked, then run for real",
    caption:
      "First, a check with no model: sound spec, current nodes, passing tests and typecheck. Then the app runs PlayAGame's scenarios in a browser, and a model judges the screenshots.",
    lines: [
      "· starting the app: bun --port=4173 ./index.html",
      "· PlayAGame: comparing its screenshots with its look",
    ],
    states: { PlayAGame: "checking" },
    inset: {
      kind: "card",
      label: "Check with no model, then the real app",
      lines: [
        "✓ spec",
        "✓ build",
        "✓ behavior: all tests plus the typecheck",
        "localhost:4173: play-a-game.e2e.ts, 7 scenarios",
        "the app stops, then a model judges the 7 screenshots",
      ],
    },
  },
  {
    id: "summary",
    seconds: 8,
    branch: false,
    title: "Everything checks out",
    caption:
      "The report prints last: what was built, then the model-free check, then the real app. The model-free part is the same check CI runs.",
    lines: [
      "✓ WatchADemo         compiled",
      "✓ App                compiled",
      "✓ spec     no errors",
      "✓ build    16 node(s) up to date",
      "✓ behavior 50 test(s) passed, typecheck ok",
      "✓ app      1 of 1 flow(s) behave as their spec says (run.app)",
      "    · 2 node(s) with scenarios have no end-to-end check yet: App, WatchADemo",
      "    ✓ PlayAGame: 7 screenshot(s) match its look",
    ],
    states: { PlayAGame: "proven" },
    inset: {
      kind: "shot",
      node: "WatchADemo",
      test: "the computer plays both sides",
      label: "WatchADemo at the end of “the computer plays both sides”",
    },
  },
];
