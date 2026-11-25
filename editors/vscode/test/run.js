// Runs the extension's end-to-end test in a real VS Code: downloads VS Code
// (cached in .vscode-test/), opens examples/tictactoe as the workspace, loads
// this extension from source, and runs suite.js inside it.
// Usage (on Linux without a display): xvfb-run -a node editors/vscode/test/run.js
"use strict";
const { join } = require("node:path");
const { runTests } = require("@vscode/test-electron");

const root = join(__dirname, "..", "..", "..");
runTests({
  version: process.env.VSCODE_VERSION || "1.106.0",
  extensionDevelopmentPath: join(__dirname, ".."),
  extensionTestsPath: join(__dirname, "suite.js"),
  launchArgs: [join(root, "examples", "tictactoe"), "--disable-extensions", "--disable-workspace-trust", "--skip-welcome", "--skip-release-notes"],
}).catch((e) => { console.error(e); process.exit(1); });
