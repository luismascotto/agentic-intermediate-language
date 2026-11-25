import { useId } from "react";
import type { CSSProperties } from "react";
import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { Stack } from "../../parts/stack";
import { CopyCommand } from "../../parts/copy-command";
import { AdoptFigure } from "./adopt-figure";

const steps: { n: string; title: string; text: string; color: string }[] = [
  {
    n: "1",
    title: "Why, from people and tickets",
    text: "The reasons come from the task tracker (Asana, Jira, Linear) and from interviewing the people who own the app. A reason nobody can confirm is written down as unknown, and every build lists it until someone answers.",
    color: "var(--color-level-product)",
  },
  {
    n: "2",
    title: "What, from the running app",
    text: "An agent finds out how to start the app, whatever it is (a website, a mobile app on a simulator, a command-line tool), along with the backend or database it needs. Each scenario's test data is created through the app's own API, never straight into its database. Then it drives every screen and error path, and writes down what it sees, quirks included.",
    color: "var(--color-level-experience)",
  },
  {
    n: "3",
    title: "How, from the code",
    text: "The code tells what the screen can't: data shapes, rules, edge cases and timing. Real inputs and outputs become examples, and every claim records where it came from.",
    color: "var(--color-level-system)",
  },
  {
    n: "4",
    title: "Proof, on the old app",
    text: "Every flow gets an end-to-end check that plays its scenarios and screenshots the screen each one ends on, on any platform. ail adopt starts the old app, runs them, commits the screenshots, and records the app as built, so the first build only builds what changes.",
    color: "var(--color-pass)",
  },
];

const figureStyle: CSSProperties = {
  background: "var(--color-surface-raised)",
  borderRadius: "var(--radius-lg)",
  padding: "clamp(16px, 4vw, 24px)",
  overflow: "hidden",
};

const stepsStyle: CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
  gap: "var(--space-4)",
};

const stepStyle: CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-lg)",
  padding: "clamp(16px, 4vw, 24px)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-2)",
};

const numberStyle: CSSProperties = {
  display: "block",
  fontFamily: "var(--font-display)",
  fontSize: "clamp(26px, 7vw, 32px)",
  fontWeight: 800,
  lineHeight: 1,
};

const titleStyle: CSSProperties = {
  fontSize: "var(--font-lead)",
  fontWeight: 700,
  color: "var(--color-text)",
  margin: 0,
};

const stepTextStyle: CSSProperties = {
  fontSize: "var(--font-body)",
  lineHeight: 1.6,
  color: "var(--color-text-muted)",
  margin: 0,
};

const commandsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
  gap: "var(--space-4)",
};

const cardStyle: CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-lg)",
  padding: "clamp(16px, 4vw, 24px)",
  minWidth: 0,
};

const cardTextStyle: CSSProperties = {
  fontSize: "var(--font-small)",
  lineHeight: 1.6,
  color: "var(--color-text-muted)",
  margin: 0,
};

const noteStyle: CSSProperties = {
  fontSize: "var(--font-small)",
  lineHeight: 1.6,
  color: "var(--color-text-muted)",
  maxWidth: "var(--width-prose)",
  margin: 0,
};

/** "a heading, a picture of an old app and a new app checked against the same spec, four steps that write and prove the spec, and the two commands that do it" */
export function AdoptSection() {
  const claudeId = useId();
  const cliId = useId();
  return (
    <Section id="adopt" tone="plain">
      <Stack dir="v" gap="space.6" align="stretch">
        <SectionHeading
          eyebrow="AIL IN REVERSE"
          text="Already have an app? Adopt it."
          lead="Most software already exists. AIL can write the spec of an app you already have, prove that the spec describes it, and from then on build it from that spec, on the same technology or a new one."
        />
        <div style={figureStyle}>
          <AdoptFigure />
        </div>
        <ol style={stepsStyle}>
          {steps.map((step) => (
            <li key={step.n} style={stepStyle}>
              <span style={{ ...numberStyle, color: step.color }}>{step.n}</span>
              <h3 style={titleStyle}>{step.title}</h3>
              <p style={stepTextStyle}>{step.text}</p>
            </li>
          ))}
        </ol>
        <div style={commandsStyle}>
          <section aria-labelledby={claudeId} style={cardStyle}>
            <Stack dir="v" gap="space.3" align="stretch">
              <h3 id={claudeId} style={titleStyle}>
                In Claude Code, Cursor or Copilot
              </h3>
              <CopyCommand command="/ail:adopt" />
              <p style={cardTextStyle}>
                The agent writes the spec one slice at a time: a screen, a flow or a rule. It asks you what only the owners know. In Cursor and Copilot, pick adopt from the / menu.
              </p>
            </Stack>
          </section>
          <section aria-labelledby={cliId} style={cardStyle}>
            <Stack dir="v" gap="space.3" align="stretch">
              <h3 id={cliId} style={titleStyle}>
                In a terminal
              </h3>
              <CopyCommand command="ail adopt" />
              <p style={cardTextStyle}>
                Starts the app as ail.config.json says, runs every end-to-end check against it, and stops it.
              </p>
            </Stack>
          </section>
        </div>
        <p style={noteStyle}>
          To move to another technology, change the spec's target and build. Every build then runs the same end-to-end checks against the new app, so it is proven to behave like the old one.
        </p>
      </Stack>
    </Section>
  );
}
