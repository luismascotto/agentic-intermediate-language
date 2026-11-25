import { useId } from "react";
import { Stack } from "../../parts/stack";
import { CodeBlock } from "../../parts/code-block";

/** a heading, why generated code is committed but collapsed in review, and the .gitattributes lines that do it */
export function ReviewNote() {
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      style={{
        background: "var(--color-surface-raised)",
        borderRadius: "var(--radius-lg)",
        padding: "clamp(16px, 4vw, 24px)",
        minWidth: 0,
      }}
    >
      <Stack dir="v" gap="space.3" align="stretch">
        <h3
          id={titleId}
          style={{
            fontSize: "var(--font-lead)",
            fontWeight: 700,
            color: "var(--color-text)",
            margin: 0,
          }}
        >
          Review the spec, not the generated code
        </h3>
        <p
          style={{
            fontSize: "var(--font-body)",
            lineHeight: 1.6,
            color: "var(--color-text-muted)",
            maxWidth: "var(--width-prose)",
            margin: 0,
          }}
        >
          Commit what ail build generates, so the app runs straight from the repository and CI can prove it was built from the spec. Then mark it as generated, and GitHub collapses it in every pull request diff: reviewers read the spec, the checks and the proof screenshots instead.
        </p>
        <CodeBlock
          lines={[
            "# .gitattributes, at the root of the repository",
            "src/gen/** linguist-generated=true",
            "ail.lock.json linguist-generated=true",
          ]}
          label=".gitattributes"
        />
      </Stack>
    </section>
  );
}
