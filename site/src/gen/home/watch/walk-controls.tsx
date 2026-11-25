import type { CSSProperties } from "react";

type WalkControlsProps = {
  mode: "play" | "pause" | "replay";
  first: boolean;
  last: boolean;
  onPrevious: () => void;
  onPlay: () => void;
  onNext: () => void;
};

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--space-2)",
  padding: "var(--space-3) var(--space-4)",
};

const sideStyle: CSSProperties = {
  flex: "1 1 0",
  minWidth: 0,
  maxWidth: "160px",
  height: "44px",
  padding: "0 var(--space-2)",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--color-code-border)",
  background: "transparent",
  color: "var(--color-code-text)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--font-small)",
  fontWeight: 600,
  cursor: "pointer",
};

const playStyle: CSSProperties = {
  flex: "1 1 0",
  minWidth: 0,
  maxWidth: "160px",
  height: "44px",
  padding: "0 var(--space-2)",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--color-thread)",
  background: "var(--color-thread)",
  color: "var(--color-code)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--font-small)",
  fontWeight: 700,
  cursor: "pointer",
};

const disabledStyle: CSSProperties = {
  opacity: 0.4,
  cursor: "default",
};

const playLabels: Record<WalkControlsProps["mode"], string> = {
  play: "Play",
  pause: "Pause",
  replay: "Replay",
};

/** three buttons on one row: Previous, the play button and Next, named "Previous chapter" and "Next chapter" */
export function WalkControls({
  mode,
  first,
  last,
  onPrevious,
  onPlay,
  onNext,
}: WalkControlsProps) {
  return (
    <div style={rowStyle}>
      <button
        type="button"
        aria-label="Previous chapter"
        disabled={first}
        onClick={onPrevious}
        style={first ? { ...sideStyle, ...disabledStyle } : sideStyle}
      >
        Previous
      </button>
      <button type="button" id="walk-play" onClick={onPlay} style={playStyle}>
        {playLabels[mode]}
      </button>
      <button
        type="button"
        aria-label="Next chapter"
        disabled={last}
        onClick={onNext}
        style={last ? { ...sideStyle, ...disabledStyle } : sideStyle}
      >
        Next
      </button>
    </div>
  );
}
