import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { Stack } from "../../parts/stack";
import { TreeFigure } from "./tree-figure";

const points = [
  {
    title: "One shape at every level",
    text: "The root states the product's promises. Its children refine them into screens and rules, and theirs into algorithms. Every node, at every depth, has the same why, what and how.",
  },
  {
    title: "Built one node at a time",
    text: "ail build compiles each node with a fresh call that sees only that node, its why chain and the contracts of the nodes it uses. ComputerPlayer is built from its own 27-line node, not from the whole spec.",
  },
  {
    title: "Checked node by node",
    text: "Each node's examples and scenarios run as tests against its own code, so every branch is checked on its own, and together they keep the promise at the top.",
  },
];

/** a heading, the real Tic-Tac-Toe spec drawn as a tree with every node, three points on what the tree shape gives, and where the idea comes from, with a link to the paper */
export function TreeSection() {
  return (
    <Section id="tree" tone="plain">
      <Stack dir="v" gap="space.6" align="stretch">
        <SectionHeading
          eyebrow="RECURSIVE BY DESIGN"
          text="A tree of tasks, the same all the way down"
          lead="Every node is a task that answers the same three questions: why it exists, what it does, and how. A node too big to answer at once hands parts to its children, which answer the same questions one level more precisely."
        />
        <div
          style={{
            background: "var(--color-surface-raised)",
            borderRadius: "var(--radius-lg)",
            padding: "clamp(16px, 4vw, 24px)",
            overflow: "hidden",
          }}
        >
          <TreeFigure />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
            gap: "var(--space-4)",
          }}
        >
          {points.map((point) => (
            <Stack
              key={point.title}
              dir="v"
              gap="space.2"
              align="start"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "clamp(16px, 4vw, 24px)",
              }}
            >
              <h3
                style={{
                  fontSize: "var(--font-lead)",
                  fontWeight: 700,
                  color: "var(--color-text)",
                  margin: 0,
                }}
              >
                {point.title}
              </h3>
              <p
                style={{
                  fontSize: "var(--font-body)",
                  lineHeight: 1.6,
                  color: "var(--color-text-muted)",
                  margin: 0,
                }}
              >
                {point.text}
              </p>
            </Stack>
          ))}
        </div>
        <Stack
          dir="v"
          gap="space.2"
          align="start"
          style={{
            background: "var(--color-code)",
            color: "var(--color-code-text)",
            borderRadius: "var(--radius-lg)",
            padding: "clamp(16px, 4vw, 24px)",
          }}
        >
          <p
            style={{
              fontSize: "var(--font-tiny)",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "var(--color-dot-amber)",
              margin: 0,
            }}
          >
            WHERE THE IDEA COMES FROM
          </p>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              fontWeight: 700,
              color: "var(--color-code-text)",
              margin: 0,
            }}
          >
            Inspired by Recursive Language Models
          </h3>
          <p
            style={{
              fontSize: "var(--font-body)",
              lineHeight: 1.6,
              color: "var(--color-code-muted)",
              maxWidth: "var(--width-prose)",
              margin: 0,
            }}
          >
            Alex L. Zhang, Tim Kraska and Omar Khattab at MIT CSAIL let a model keep a long prompt outside itself and call itself, recursively, on just the parts it needs. AIL applies the same idea to building software: the spec is the environment, and each node is compiled by a fresh call that sees only its part.
          </p>
          <a
            href="https://arxiv.org/abs/2512.24601"
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: "44px",
              fontSize: "var(--font-small)",
              fontWeight: 700,
              color: "var(--color-thread)",
              textDecoration: "none",
            }}
          >
            Read the paper (arXiv:2512.24601) ↗
          </a>
        </Stack>
      </Stack>
    </Section>
  );
}
