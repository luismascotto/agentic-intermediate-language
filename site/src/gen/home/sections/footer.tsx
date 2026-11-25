import { Stack } from "../../parts/stack";

const linkStyle = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "44px",
  color: "var(--color-code-text)",
  fontWeight: 600,
  textDecoration: "underline",
};

/** a strip of the four level colors, one sentence on where this page and the game came from, and seven links */
export function Footer() {
  return (
    <footer
      style={{
        background: "var(--color-code)",
        color: "var(--color-code-muted)",
        fontSize: "var(--font-small)",
      }}
    >
      <div style={{ height: "4px", display: "flex" }}>
        <div style={{ flex: 1, background: "var(--color-level-product)" }} />
        <div style={{ flex: 1, background: "var(--color-level-experience)" }} />
        <div style={{ flex: 1, background: "var(--color-level-system)" }} />
        <div style={{ flex: 1, background: "var(--color-level-specialist)" }} />
      </div>
      <Stack
        dir="v"
        gap="space.4"
        align="start"
        style={{
          maxWidth: "var(--width-content)",
          margin: "0 auto",
          boxSizing: "content-box",
          padding: "clamp(24px, 6vw, 32px) var(--space-4)",
        }}
      >
        <p
          style={{
            lineHeight: 1.6,
            maxWidth: "var(--width-prose)",
            margin: 0,
          }}
        >
          Brewed in AIL. This page was compiled from the spec in site/ail/, and the game from the spec in examples/tictactoe/ail/. Apart from the spec and a short index.html, nothing in either was written by hand.
        </p>
        <nav
          aria-label="More about AIL"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            columnGap: "var(--space-4)",
            rowGap: 0,
          }}
        >
          <a href="https://github.com/ffMathy/agentic-intermediate-language" style={linkStyle}>
            GitHub
          </a>
          <a
            href="https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/proposal.md"
            style={linkStyle}
          >
            Design proposal
          </a>
          <a
            href="https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/language.md"
            style={linkStyle}
          >
            Language definition
          </a>
          <a
            href="https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/claude-code.md"
            style={linkStyle}
          >
            Claude Code guide
          </a>
          <a
            href="https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/cursor.md"
            style={linkStyle}
          >
            Cursor guide
          </a>
          <a
            href="https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/copilot.md"
            style={linkStyle}
          >
            Copilot guide
          </a>
          <a
            href="https://github.com/ffMathy/agentic-intermediate-language/tree/main/site"
            style={linkStyle}
          >
            This site's spec
          </a>
        </nav>
      </Stack>
    </footer>
  );
}
