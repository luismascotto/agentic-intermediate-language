/** the chapter's number out of all of them, its title as a level 3 heading, then its caption; a branch chapter says that it is a branch off the main path */
export function WalkCaption({
  n,
  count,
  branch,
  title,
  caption,
}: {
  n: number;
  count: number;
  branch: boolean;
  title: string;
  caption: string;
}) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-1)",
        padding: "var(--space-3) var(--space-4)",
        background: "var(--color-code-bar)",
        borderBottom: "1px solid var(--color-code-border)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-mono)",
          fontSize: "var(--font-tiny)",
          color: "var(--color-code-muted)",
        }}
      >
        {branch
          ? `Chapter ${n} of ${count} · a branch off the main path`
          : `Chapter ${n} of ${count}`}
      </p>
      <h3
        style={{
          margin: 0,
          fontFamily: "var(--font-sans)",
          fontSize: "var(--font-body)",
          fontWeight: 700,
          lineHeight: 1.4,
          color: "var(--color-code-text)",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: "var(--font-small)",
          lineHeight: 1.6,
          color: "var(--color-code-text)",
          maxWidth: "var(--width-prose)",
        }}
      >
        {caption}
      </p>
    </div>
  );
}
