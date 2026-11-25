import { Stack } from "../../parts/stack";

const links = [
  { href: "#journey", text: "The journey" },
  { href: "#watch", text: "Watch it work" },
  { href: "#readers", text: "Four readers" },
  { href: "#loop", text: "How it builds" },
  { href: "#adopt", text: "Adopt an app" },
  { href: "#specs", text: "Browse the specs" },
  { href: "#start", text: "Get started" },
  { href: "https://github.com/ffMathy/agentic-intermediate-language", text: "GitHub ↗" },
];

/** the name of the project on the left, and eight links on the right */
export function TopBar() {
  return (
    <header
      style={{
        width: "100%",
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        boxSizing: "border-box",
        padding: "var(--space-2) var(--space-4)",
      }}
    >
      <Stack
        dir="h"
        gap="space.2"
        align="center"
        justify="between"
        wrap={true}
        style={{ maxWidth: "var(--width-content)", margin: "0 auto" }}
      >
        <Stack dir="h" gap="space.2" align="center" wrap={true}>
          <svg
            aria-hidden="true"
            viewBox="0 0 22 28"
            width="22px"
            height="28px"
            style={{ display: "block" }}
          >
            <path
              d="M3 4 H19 L17.5 26 H4.5 Z"
              fill="var(--color-level-experience)"
              stroke="var(--color-text)"
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <path
              d="M3 4 H19 L18.6 10 H3.4 Z"
              fill="var(--color-page)"
              stroke="var(--color-text)"
              strokeWidth={2}
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "24px",
              fontWeight: 800,
              color: "var(--color-text)",
              letterSpacing: "-0.01em",
            }}
          >
            AIL
          </span>
          <span
            style={{
              fontSize: "var(--font-small)",
              color: "var(--color-text-muted)",
            }}
          >
            Agentic Intermediate Language
          </span>
        </Stack>
        <nav
          aria-label="Sections"
          style={{
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "center",
            columnGap: "var(--space-4)",
            maxWidth: "100%",
            overflowX: "auto",
          }}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontSize: "var(--font-small)",
                fontWeight: 600,
                color: "var(--color-text)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                minHeight: "44px",
                flex: "none",
                whiteSpace: "nowrap",
              }}
            >
              {link.text}
            </a>
          ))}
        </nav>
      </Stack>
    </header>
  );
}
