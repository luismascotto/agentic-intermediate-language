import type { CSSProperties, ReactNode } from "react";
import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { Stack } from "../../parts/stack";

const cardsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
  gap: "var(--space-4)",
};

const cardStyle: CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-lg)",
  padding: "clamp(16px, 4vw, 24px)",
};

const thirdCardStyle: CSSProperties = {
  ...cardStyle,
  background: "var(--color-code)",
  border: "1px solid var(--color-code)",
};

const titleStyle: CSSProperties = {
  fontSize: "var(--font-lead)",
  fontWeight: 700,
  lineHeight: 1.3,
  color: "var(--color-text)",
  margin: 0,
};

const thirdTitleStyle: CSSProperties = {
  ...titleStyle,
  color: "var(--color-thread)",
};

const bodyStyle: CSSProperties = {
  fontSize: "var(--font-body)",
  lineHeight: 1.6,
  color: "var(--color-text-muted)",
  margin: 0,
};

const thirdBodyStyle: CSSProperties = {
  ...bodyStyle,
  color: "var(--color-code-text)",
};

const tipStyle: CSSProperties = {
  fontSize: "var(--font-small)",
  fontWeight: 600,
  margin: 0,
  color: "var(--color-code-muted)",
};

function Icon(props: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      width="40px"
      height="40px"
    >
      {props.children}
    </svg>
  );
}

/** "an eyebrow, a heading and three cards: a request is too vague, code is too detailed, and AIL is the layer in between" */
export function GapStrip() {
  return (
    <Section tone="raised">
      <SectionHeading eyebrow="THE PROBLEM" text="Between a prompt and the code, there is nothing to review." />
      <div style={cardsStyle}>
        <Stack dir="v" gap="space.3" align="start" style={cardStyle}>
          <Icon>
            <path
              d="M12 30 H30 A7 7 0 0 0 30 16 A10 10 0 0 0 11 14 A8 8 0 0 0 12 30 Z"
              style={{
                fill: "none",
                stroke: "var(--color-text-muted)",
                strokeWidth: 2,
              }}
            />
          </Icon>
          <h3 style={titleStyle}>A prompt is too vague</h3>
          <p style={bodyStyle}>
            Give two models the same prompt and you get two different apps, and nobody can say which one is right.
          </p>
        </Stack>
        <Stack dir="v" gap="space.3" align="start" style={cardStyle}>
          <Icon>
            <rect
              x="2"
              y="6"
              width="36"
              height="28"
              rx="4"
              style={{ fill: "var(--color-code)" }}
            />
            <line
              x1="8"
              y1="14"
              x2="28"
              y2="14"
              style={{
                stroke: "var(--color-code-text)",
                strokeWidth: 2,
                strokeLinecap: "round",
              }}
            />
            <line
              x1="8"
              y1="20"
              x2="22"
              y2="20"
              style={{
                stroke: "var(--color-code-text)",
                strokeWidth: 2,
                strokeLinecap: "round",
              }}
            />
            <line
              x1="8"
              y1="26"
              x2="32"
              y2="26"
              style={{
                stroke: "var(--color-code-text)",
                strokeWidth: 2,
                strokeLinecap: "round",
              }}
            />
          </Icon>
          <h3 style={titleStyle}>Code is too detailed</h3>
          <p style={bodyStyle}>
            Most people who decide what a product does can't read the code that decides it, and nobody reads all of it.
          </p>
        </Stack>
        <Stack dir="v" gap="space.3" align="start" style={thirdCardStyle}>
          <Icon>
            <rect
              x="4"
              y="6"
              width="32"
              height="6"
              rx="3"
              style={{ fill: "var(--color-level-product)" }}
            />
            <rect
              x="4"
              y="14"
              width="32"
              height="6"
              rx="3"
              style={{ fill: "var(--color-level-experience)" }}
            />
            <rect
              x="4"
              y="22"
              width="32"
              height="6"
              rx="3"
              style={{ fill: "var(--color-level-system)" }}
            />
            <rect
              x="4"
              y="30"
              width="32"
              height="6"
              rx="3"
              style={{ fill: "var(--color-level-specialist)" }}
            />
          </Icon>
          <h3 style={thirdTitleStyle}>AIL is the layer in between</h3>
          <p style={thirdBodyStyle}>
            A tree of plain sentences that gets more precise as you go down. People review it, models compile it one node at a time, and checks prove the result.
          </p>
          <p style={tipStyle}>
            Read it from the top, and stop where the detail stops mattering to you.
          </p>
        </Stack>
      </div>
    </Section>
  );
}
