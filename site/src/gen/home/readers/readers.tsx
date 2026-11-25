import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { Stack } from "../../parts/stack";
import { ReadersTree } from "./readers-tree";

type Reader = "stakeholder" | "design" | "engineer" | "specialist";

const readers: Reader[] = ["stakeholder", "design", "engineer", "specialist"];

const names: Record<Reader, string> = {
  stakeholder: "Stakeholder",
  design: "Design",
  engineer: "Engineer",
  specialist: "Specialist",
};

const levels: Record<Reader, string> = {
  stakeholder: "PRODUCT LEVEL",
  design: "EXPERIENCE LEVEL",
  engineer: "SYSTEM LEVEL",
  specialist: "SPECIALIST LEVEL",
};

const texts: Record<Reader, string> = {
  stakeholder:
    "Reads the six promises at the top and the scenarios under them in plain words, and can sign off on “The computer never loses.” without reading any code.",
  design:
    "Reads the scenarios, the layout in design tokens, and every word on screen, such as “X's turn”, “X wins!” and “New game”.",
  engineer:
    "Reads everything down to the contracts, with the specialists' how folded away: the types, and the examples that run as tests, such as evaluate(boardFrom(\"XOX/XOO/OXX\")) => ({ kind: \"draw\" }).",
  specialist:
    "Reads the algorithm, its invariant and how it is proved: full minimax, memoized by board, checked against every possible game.",
};

const colors: Record<Reader, string> = {
  stakeholder: "var(--color-level-product)",
  design: "var(--color-level-experience)",
  engineer: "var(--color-level-system)",
  specialist: "var(--color-level-specialist)",
};

/** "four tabs, "Stakeholder", "Design", "Engineer" and "Specialist", named together as "Readers"; "Stakeholder" is picked first" */
export function Readers() {
  const [reader, setReader] = useState<Reader>("stakeholder");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === "ArrowRight") {
      next = (index + 1) % readers.length;
    } else if (event.key === "ArrowLeft") {
      next = (index - 1 + readers.length) % readers.length;
    } else {
      return;
    }
    setReader(readers[next]);
    tabRefs.current[next]?.focus();
  };

  return (
    <Section id="readers" tone="plain">
      <SectionHeading
        text="One spec, four readers"
        lead="Each level of the tree is written for one kind of reader. Pick a reader to see which level is theirs: they start at the top and stop where the detail stops mattering to them."
      />
      <div
        role="tablist"
        aria-label="Readers"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "var(--space-2)",
          maxWidth: "640px",
        }}
      >
        {readers.map((key, index) => {
          const picked = key === reader;
          return (
            <button
              key={key}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`reader-tab-${key}`}
              aria-selected={picked}
              aria-controls="reader-panel"
              tabIndex={picked ? 0 : -1}
              onClick={() => setReader(key)}
              onKeyDown={(event) => onKeyDown(event, index)}
              style={{
                height: "44px",
                padding: "0 var(--space-4)",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--font-small)",
                fontWeight: 600,
                cursor: "pointer",
                background: picked ? colors[key] : "var(--color-surface)",
                border: picked
                  ? `1px solid ${colors[key]}`
                  : "1px solid var(--color-border)",
                color: picked ? "var(--color-on-accent)" : "var(--color-text)",
              }}
            >
              {names[key]}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id="reader-panel"
        aria-labelledby={`reader-tab-${reader}`}
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "clamp(16px, 4vw, 24px)",
        }}
      >
        <Stack dir="v" gap="space.4" align="stretch">
          <div
            style={{
              fontSize: "var(--font-tiny)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: colors[reader],
            }}
          >
            {levels[reader]}
          </div>
          <p
            style={{
              fontSize: "var(--font-lead)",
              lineHeight: 1.6,
              color: "var(--color-text)",
              maxWidth: "var(--width-prose)",
              margin: 0,
            }}
          >
            {texts[reader]}
          </p>
          <ReadersTree reader={reader} />
        </Stack>
      </div>
    </Section>
  );
}
