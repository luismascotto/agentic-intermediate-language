import type { CSSProperties } from "react";
import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { Stack } from "../../parts/stack";
import { CopyCommand } from "../../parts/copy-command";
import { AgentCards } from "./get-started/agent-cards";
import { ReviewNote } from "./review-note";

const cardStyle: CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-lg)",
  padding: "clamp(16px, 4vw, 24px)",
  minWidth: 0,
};

const titleStyle: CSSProperties = {
  fontSize: "var(--font-lead)",
  fontWeight: 700,
  color: "var(--color-text)",
  margin: 0,
};

const subtitleStyle: CSSProperties = {
  fontSize: "var(--font-small)",
  color: "var(--color-text-muted)",
  margin: 0,
};

const textStyle: CSSProperties = {
  fontSize: "var(--font-body)",
  lineHeight: 1.6,
  color: "var(--color-text-muted)",
  margin: 0,
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const rowStyle: CSSProperties = {
  borderBottom: "1px solid var(--color-border)",
};

const cellStyle: CSSProperties = {
  padding: "var(--space-2) var(--space-2) var(--space-2) 0",
  verticalAlign: "top",
  fontSize: "var(--font-small)",
  textAlign: "left",
};

const commandCellStyle: CSSProperties = {
  ...cellStyle,
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-code)",
  fontWeight: 600,
  color: "var(--color-accent)",
  whiteSpace: "nowrap",
};

const listStyle: CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const listItemStyle: CSSProperties = {
  padding: "var(--space-2) 0",
  borderBottom: "1px solid var(--color-border)",
};

const listCommandStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-code)",
  fontWeight: 600,
  color: "var(--color-accent)",
  margin: 0,
};

const listDoesStyle: CSSProperties = {
  fontSize: "var(--font-small)",
  lineHeight: 1.5,
  color: "var(--color-text)",
  margin: "var(--space-1) 0 0",
};

const closingStyle: CSSProperties = {
  fontSize: "var(--font-small)",
  fontWeight: 600,
  color: "var(--color-text)",
  margin: 0,
};

const cardsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
  gap: "var(--space-6)",
  alignItems: "start",
};

const linkBaseStyle: CSSProperties = {
  border: "2px solid var(--color-accent)",
  borderRadius: "var(--radius-md)",
  padding: "var(--space-3) var(--space-6)",
  fontWeight: 700,
  textDecoration: "none",
  flex: "1 1 220px",
  maxWidth: "360px",
  textAlign: "center",
  boxSizing: "border-box",
};

const exampleStyle: CSSProperties = {
  ...linkBaseStyle,
  background: "var(--color-accent)",
  color: "var(--color-on-accent)",
};

const repoStyle: CSSProperties = {
  ...linkBaseStyle,
  background: "var(--color-surface)",
  color: "var(--color-accent)",
};

const cliRows: { command: string; does: string }[] = [
  {
    command: "ail build",
    does: "Compile whatever changed, then check everything: the spec, the code, every test, and each screen against its look.",
  },
  {
    command: "ail show [what]",
    does: "The tree, one node, or what changed since a git ref.",
  },
  {
    command: "ail adopt",
    does: "Does an existing app behave as its spec says? For bringing an app under AIL, and proving a rebuilt one behaves the same.",
  },
];

/** "four cards, "In Claude Code", then the two AgentCards ("In Cursor" and "In GitHub Copilot"), then "In a terminal", in that order, side by side when there is room" */
export function GetStarted() {
  return (
    <Section id="start" tone="plain">
      <Stack dir="v" gap="space.6" align="stretch">
        <SectionHeading
          text="Start in two minutes"
          lead="Install it, then describe a feature in plain words. You get a spec you can review, and code that is checked against it."
        />
        <div style={cardsStyle}>
          <section aria-label="In Claude Code" style={cardStyle}>
            <Stack dir="v" gap="space.3" align="stretch">
              <h3 style={titleStyle}>In Claude Code</h3>
              <p style={subtitleStyle}>No API key. It runs on your Claude subscription.</p>
              <CopyCommand command="/plugin marketplace add ffMathy/agentic-intermediate-language" />
              <CopyCommand command="/plugin install ail@agentic-intermediate-language" />
              <p style={textStyle}>
                Then ask for features in plain words. Claude changes the spec, and /ail:build compiles whatever changed.
              </p>
            </Stack>
          </section>
          <AgentCards />
          <section aria-label="In a terminal" style={cardStyle}>
            <Stack dir="v" gap="space.3" align="stretch">
              <h3 style={titleStyle}>In a terminal</h3>
              <p style={subtitleStyle}>Needs Bun 1.2 or later.</p>
              <CopyCommand command="bun add -g github:ffMathy/agentic-intermediate-language" />
              <table className="ail-wide" style={tableStyle}>
                <thead>
                  <tr style={rowStyle}>
                    <th scope="col" style={cellStyle}>
                      Command
                    </th>
                    <th scope="col" style={cellStyle}>
                      What it does
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cliRows.map((row) => (
                    <tr key={row.command} style={rowStyle}>
                      <td style={commandCellStyle}>{row.command}</td>
                      <td style={cellStyle}>{row.does}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ul className="ail-narrow" style={listStyle}>
                {cliRows.map((row) => (
                  <li key={row.command} style={listItemStyle}>
                    <p style={listCommandStyle}>{row.command}</p>
                    <p style={listDoesStyle}>{row.does}</p>
                  </li>
                ))}
              </ul>
              <p style={closingStyle}>That's the whole tool: three commands.</p>
              <p style={textStyle}>
                Run these inside a project, meaning any folder with an ail.config.json. To try the tic-tac-toe demo from this page:
              </p>
              <CopyCommand command="git clone https://github.com/ffMathy/agentic-intermediate-language" />
              <CopyCommand command="cd agentic-intermediate-language && bun install && bun link" />
              <CopyCommand command="cd examples/tictactoe && bun install && ail build" />
              <CopyCommand command="ail show" />
            </Stack>
          </section>
        </div>
        <ReviewNote />
        <Stack dir="h" gap="space.3" align="center" wrap={true}>
          <a
            href="https://github.com/ffMathy/agentic-intermediate-language/tree/main/examples/tictactoe"
            style={exampleStyle}
          >
            Read the Tic-Tac-Toe spec
          </a>
          <a href="https://github.com/ffMathy/agentic-intermediate-language" style={repoStyle}>
            View on GitHub ↗
          </a>
        </Stack>
      </Stack>
    </Section>
  );
}
