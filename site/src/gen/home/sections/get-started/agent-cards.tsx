import { useId } from "react";
import type { CSSProperties } from "react";
import { Stack } from "../../../parts/stack";
import { CopyCommand } from "../../../parts/copy-command";

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

/** two cards, "In Cursor" and "In GitHub Copilot", in that order; they are placed straight into GetStarted's grid of cards, next to its other cards, with no box of their own around them */
export function AgentCards() {
  const cursorId = useId();
  const copilotId = useId();
  return (
    <>
      <section role="region" aria-labelledby={cursorId} style={cardStyle}>
        <Stack dir="v" gap="space.3" align="stretch">
          <h3 id={cursorId} style={titleStyle}>
            In Cursor
          </h3>
          <p style={subtitleStyle}>
            No API key. Builds run on your Cursor subscription.
          </p>
          <CopyCommand command="git clone https://github.com/ffMathy/agentic-intermediate-language ~/.cursor/plugins/local/ail" />
          <p style={textStyle}>
            Then run Developer: Reload Window. Teams can import the repository as a team marketplace instead. The same skill, commands and hooks as in Claude Code.
          </p>
        </Stack>
      </section>
      <section role="region" aria-labelledby={copilotId} style={cardStyle}>
        <Stack dir="v" gap="space.3" align="stretch">
          <h3 id={copilotId} style={titleStyle}>
            In GitHub Copilot
          </h3>
          <p style={subtitleStyle}>
            No API key. Builds run on your Copilot subscription.
          </p>
          <CopyCommand command="copilot plugin marketplace add ffMathy/agentic-intermediate-language" />
          <CopyCommand command="copilot plugin install ail@agentic-intermediate-language" />
          <p style={textStyle}>
            That&apos;s the Copilot CLI. In VS Code, add the same repository under chat.plugins.marketplaces and install ail from Agent Customizations.
          </p>
        </Stack>
      </section>
    </>
  );
}
