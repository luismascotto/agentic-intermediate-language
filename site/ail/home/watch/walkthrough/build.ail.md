# The build walkthrough

In `examples/tictactoe`, someone speeds up the demo: in WatchADemo's spec they
change "600 ms" to "500 ms" on five lines, then run `ail build`. The rest of
the project is already built and passing. Every terminal line is a real
output format of `ail build`; the rejected first attempt and the STOP branch
are illustrative.

```ail
node BuildWalkthrough : data   level: system
  why   Show what one ail build does with a small spec change, chapter by chapter, from the edit to the checked result.   <- WalkthroughPlayer
  what
    BUILD: Walkthrough = { command: "ail build", place: "terminal · examples/tictactoe", picture: "Tic-Tac-Toe spec · 16 nodes", rest: "fresh", beats: the five beats of BUILD_FIRST_HALF, then the five of BUILD_SECOND_HALF, in their order }
    examples
      BUILD.beats.length => 10
      totalSeconds(BUILD) => 85
      clock(totalSeconds(BUILD)) => "1:25"
      chapterStart(BUILD, 2) => 15
      BUILD.beats[0].lines[0] => "$ ail build"
      BUILD.beats[1].lines.length => 0
      BUILD.beats[6].branch => true
      BUILD.beats[5].branch => false
      stateOf(BUILD, 1, "App") => "stale"
      stateOf(BUILD, 1, "Rules") => "fresh"
      stateOf(BUILD, 6, "WatchADemo") => "stopped"
      stateOf(BUILD, 6, "App") => "skipped"
      stateOf(BUILD, 3, "Button") => "contract"
      stateOf(BUILD, 3, "TicTacToe") => "fresh"
      statesIn(BUILD) => ["fresh", "stale", "writing", "compiling", "contract", "checking", "rejected", "stopped", "skipped", "proven"]
  how
    decide the stop chapter is the only branch
      because it shows what would happen with a half-made edit, then the walkthrough rejoins the main path, where all five lines were changed
  uses      Walkthrough, BuildFirstHalf, BuildSecondHalf
  children  BuildFirstHalf, BuildSecondHalf
```

```ail
node BuildFirstHalf : data   level: system
  why   The first five chapters of the build walkthrough: from the edit to the rejected first attempt.   <- BuildWalkthrough
  what
    BUILD_FIRST_HALF: list of Beat = [
        { id: "edit", seconds: 6, branch: false, title: "The spec changes, not code",
          caption: "The spec is the source of truth, so the change goes there: one move every 500 ms. Five lines change. Nobody touches src/gen; hooks block edits there.",
          lines: ["$ ail build"],
          states: { "WatchADemo": "writing" },
          inset: { kind: "card", label: "ail/app/demo/demo.ail.md: 600 → 500 ms on five lines", lines: ["what      one move every 500 ms", "scenario  When 500 ms pass", "scenario  When another 500 ms pass", "how       decide one move every 500 ms", "binds     autoplay … after 500 ms …"] } },
        { id: "stale", seconds: 9, branch: false, title: "What is out of date",
          caption: "A compile hash covers a node's spec, its ancestors' why, the target and the contracts it uses. WatchADemo changed, so it is stale; App uses its contract, so it is too.",
          lines: [],
          states: { "WatchADemo": "stale", "App": "stale" },
          inset: { kind: "card", label: "A node's compile hash covers", lines: ["its own spec", "its ancestors' why", "the target", "the contract (what + binds) of each node it uses"] } },
        { id: "derive", seconds: 9, branch: false, title: "Checks written once, then pinned",
          caption: "The scenarios changed, so a model turns each into a test stamped with the spec's hash. You review and commit it, and from then on it defines what is correct.",
          lines: [
            "· App: deriving checks from its scenarios",
            "· WatchADemo: deriving checks from its scenarios",
            "· WatchADemo: wrote checks/app/demo/watch-a-demo.test.tsx; review it, since it now defines \"correct\"",
            "· App: wrote checks/app/app.test.tsx; review it, since it now defines \"correct\""],
          states: { "WatchADemo": "stale", "App": "stale" },
          inset: { kind: "card", label: "checks/app/demo/watch-a-demo.test.tsx", lines: ["// ail-derived-from: WatchADemo@<16 hex>", "the demo starts on its own → test(…)", "the computer plays both sides → test(…)", "perfect play ends in a draw → test(…)", "watch again → test(…)"] } },
        { id: "isolate", seconds: 9, branch: false, title: "Each node sees only its slice",
          caption: "WatchADemo is compiled alone. The model gets the target, tokens, glossary, its parents' why, its full spec and only the contracts of what it uses. It may write one file.",
          lines: ["· WatchADemo: attempt 1 with claude-code"],
          states: { "WatchADemo": "compiling", "App": "stale", "StatusLine": "contract", "BoardView": "contract", "GameState": "contract", "GameReducer": "contract", "ComputerPlayer": "contract", "Stack": "contract", "Button": "contract" },
          inset: { kind: "card", label: "Compile context: WatchADemo", lines: ["Target, design tokens, glossary", "Why chain: TicTacToe → App", "The node to implement: WatchADemo, full spec", "Contracts only: StatusLine, BoardView, GameState, GameReducer, ComputerPlayer, Stack, Button", "Never sent: other nodes' how, src/gen files", "The only file it may write: src/gen/app/demo/watch-a-demo.tsx"] } },
        { id: "verify", seconds: 10, branch: false, title: "Rejected, then tried again",
          caption: "The new file is checked: it exists, imports only what uses allows, and passes its pinned tests. If not, the old file returns and the model retries with the failures.",
          lines: [
            "· WatchADemo: attempt 1 rejected",
            "- tests: ✗ the computer plays both sides [612.00ms]",
            "error: expect(received).toBe(expected)",
            "Expected: \"O\"",
            "Received: \"\"",
            "· WatchADemo: attempt 2 with claude-code"],
          states: { "WatchADemo": "rejected", "App": "stale" },
          inset: { kind: "card", label: "WatchADemo, attempt 1 of 3", lines: ["✓ exists", "✓ imports", "✗ tests", "previous version restored", "attempt 2 of 3 gets the failures and the earlier reply"] } }
      ]
    examples
      BUILD_FIRST_HALF.length => 5
      BUILD_FIRST_HALF[4].id => "verify"
      BUILD_FIRST_HALF[4].lines.length => 6
  uses  Walkthrough
```

```ail
node BuildSecondHalf : data   level: system
  why   The last five chapters of the build walkthrough: from the screens judged to the final report.   <- BuildWalkthrough
  what
    BUILD_SECOND_HALF: list of Beat = [
        { id: "look", seconds: 10, branch: false, title: "Screens judged against the look",
          caption: "Tests prove behaviour, not looks. Each test's final screen is screenshotted, and a model compares it with the node's look and copy. A mismatch sends it back, like a failing test.",
          lines: ["· WatchADemo: 4 screen(s) match its look", "· App: attempt 1 with claude-code", "· App: 2 screen(s) match its look"],
          states: { "WatchADemo": "proven", "App": "proven" },
          inset: { kind: "shot", node: "WatchADemo", test: "perfect play ends in a draw", label: "WatchADemo: 4 screens judged against its look", verdict: "MATCHES" } },
        { id: "stop", seconds: 8, branch: true, title: "Branch: the spec must decide",
          caption: "Suppose only what said 500 ms. The compiler won't pick a pace: it replies STOP with a question, its dependants wait, and the answer goes into the spec.",
          lines: [
            "? WatchADemo         stopped: `what` says one move every 500 ms, but `how` decides one move every 600 ms and `binds` waits 600 ms. Which pace is it?",
            "… App                skipped: waiting for WatchADemo",
            "",
            "✓ spec     no errors",
            "✗ build    2 output(s) not built from the current spec — run `ail build`",
            "✗ behavior 1 node(s) failed",
            "",
            "The spec doesn't decide the questions above. Answer them in the .ail.md files, then build again."],
          states: { "WatchADemo": "stopped", "App": "skipped" },
          inset: { kind: "card", label: "Branch: a what-if", lines: ["STOP: which pace is it?", "what says 500 ms; how and binds say 600 ms", "the answer goes into ail/app/demo/demo.ail.md", "never into src/gen", "… App waits for WatchADemo"] } },
        { id: "lock", seconds: 7, branch: false, title: "Recorded in the lock",
          caption: "The lock records the new compile hash, a hash of the file, who built it, and its shots and look marks. An unchanged node with a matching look mark is a cache hit; a hand-edited file is rebuilt.",
          lines: [],
          states: {},
          inset: { kind: "card", label: "ail.lock.json", lines: ["\"WatchADemo\": {", "  \"hash\": \"<new 64-hex>\",", "  \"files\": { \"src/gen/app/demo/watch-a-demo.tsx\": \"<sha256>\" },", "  \"by\": \"claude-code\",", "  \"shots\": \"<same as hash>\",", "  \"look\": \"<same as hash>\"", "}"] } },
        { id: "e2e", seconds: 9, branch: false, title: "Checked, then run for real",
          caption: "First, a check with no model: sound spec, current nodes, passing tests and typecheck. Then the app runs PlayAGame's scenarios in a browser, and a model judges the screenshots.",
          lines: ["· starting the app: bun --port=4173 ./index.html", "· PlayAGame: comparing its screenshots with its look"],
          states: { "PlayAGame": "checking" },
          inset: { kind: "card", label: "Check with no model, then the real app", lines: ["✓ spec", "✓ build", "✓ behavior: all tests plus the typecheck", "localhost:4173: play-a-game.e2e.ts, 7 scenarios", "the app stops, then a model judges the 7 screenshots"] } },
        { id: "summary", seconds: 8, branch: false, title: "Everything checks out",
          caption: "The report prints last: what was built, then the model-free check, then the real app. The model-free part is the same check CI runs.",
          lines: [
            "✓ WatchADemo         compiled",
            "✓ App                compiled",
            "✓ spec     no errors",
            "✓ build    16 node(s) up to date",
            "✓ behavior 50 test(s) passed, typecheck ok",
            "✓ app      1 of 1 flow(s) behave as their spec says (run.app)",
            "    · 2 node(s) with scenarios have no end-to-end check yet: App, WatchADemo",
            "    ✓ PlayAGame: 7 screenshot(s) match its look"],
          states: { "PlayAGame": "proven" },
          inset: { kind: "shot", node: "WatchADemo", test: "the computer plays both sides", label: "WatchADemo at the end of “the computer plays both sides”" } }
      ]
    examples
      BUILD_SECOND_HALF.length => 5
      BUILD_SECOND_HALF[1].id => "stop"
      BUILD_SECOND_HALF[1].lines.length => 8
  uses  Walkthrough
```
