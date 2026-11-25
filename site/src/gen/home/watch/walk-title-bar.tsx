import type { CSSProperties, KeyboardEvent } from "react";

export type WalkTab = "build" | "adopt";

export type WalkTitleBarProps = {
  tab: WalkTab;
  now: string;
  total: string;
  onPick: (tab: WalkTab) => void;
};

const tabs: { key: WalkTab; label: string }[] = [
  { key: "build", label: "ail build" },
  { key: "adopt", label: "ail adopt" },
];

const barStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--space-3)",
  padding: "var(--space-1) var(--space-3)",
  background: "var(--color-code-bar)",
  borderBottom: "1px solid var(--color-code-border)",
};

const dotsStyle: CSSProperties = {
  display: "flex",
  gap: "6px",
};

const dotColors = [
  "var(--color-dot-red)",
  "var(--color-dot-amber)",
  "var(--color-dot-green)",
];

const tablistStyle: CSSProperties = {
  display: "flex",
  gap: "var(--space-1)",
};

const timeStyle: CSSProperties = {
  margin: "0 0 0 auto",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-small)",
  color: "var(--color-code-muted)",
};

function tabStyle(picked: boolean): CSSProperties {
  return {
    height: "44px",
    padding: "0 var(--space-3)",
    borderRadius: "var(--radius-md)",
    border: "none",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--font-small)",
    fontWeight: 600,
    cursor: "pointer",
    background: picked ? "var(--color-code-pick)" : "transparent",
    color: picked ? "var(--color-code-text)" : "var(--color-code-muted)",
  };
}

/** "three window dots, the tabs "ail build" and "ail adopt", then the time played and the total time" */
export function WalkTitleBar({ tab, now, total, onPick }: WalkTitleBarProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, key: WalkTab) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }
    const other: WalkTab = key === "build" ? "adopt" : "build";
    onPick(other);
    document.getElementById(`walk-tab-${other}`)?.focus();
  }

  return (
    <div style={barStyle}>
      <div aria-hidden="true" style={dotsStyle}>
        {dotColors.map((color) => (
          <span
            key={color}
            style={{
              display: "block",
              width: "10px",
              height: "10px",
              borderRadius: "var(--radius-pill)",
              background: color,
            }}
          />
        ))}
      </div>
      <div role="tablist" aria-label="Walkthroughs" style={tablistStyle}>
        {tabs.map(({ key, label }) => {
          const picked = key === tab;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              id={`walk-tab-${key}`}
              aria-selected={picked}
              aria-controls="walk-panel"
              tabIndex={picked ? 0 : -1}
              style={tabStyle(picked)}
              onClick={() => onPick(key)}
              onKeyDown={(event) => handleKeyDown(event, key)}
            >
              {label}
            </button>
          );
        })}
      </div>
      <p style={timeStyle}>
        <span style={{ color: "var(--color-code-text)" }}>{now}</span>
        {` / ${total}`}
      </p>
    </div>
  );
}
