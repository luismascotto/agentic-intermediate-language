import { specProjects } from "../../../spec";
import { Stack } from "../../../parts/stack";

const tests = ["winning", "the computer answers"];

/** "two screenshots of the demo's play screen, taken at the end of its checks "winning" and "the computer answers", side by side when there is room, each with a check mark and the check's name under it" */
export function ProofScreens() {
  const project = specProjects.find((p) => p.key === "tictactoe");
  const shots = tests.flatMap((test) => {
    const shot = project?.shots.find((s) => s.node === "PlayAGame" && s.test === test);
    return shot ? [shot] : [];
  });
  return (
    <Stack dir="v" gap="space.3" align="stretch">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(128px, 100%), 1fr))",
          gap: "var(--space-3)",
          width: "100%",
        }}
      >
        {shots.map((shot) => (
          <figure
            key={shot.test}
            style={{
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-1)",
            }}
          >
            <img
              src={shot.src}
              alt={`Screenshot at the end of the check “${shot.test}”`}
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                boxSizing: "border-box",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
              }}
            />
            <figcaption
              style={{
                fontSize: "var(--font-tiny)",
                color: "var(--color-text-muted)",
                textAlign: "center",
              }}
            >
              <span style={{ color: "var(--color-pass)", fontWeight: 700 }}>✓</span>
              {" "}
              {`“${shot.test}”`}
            </figcaption>
          </figure>
        ))}
      </div>
      <p
        style={{
          fontSize: "var(--font-tiny)",
          color: "var(--color-text-muted)",
          margin: 0,
          textAlign: "center",
          overflowWrap: "anywhere",
        }}
      >
        Committed with the checks, in{" "}
        <code style={{ fontFamily: "var(--font-mono)" }}>examples/tictactoe/checks/shots/</code>
      </p>
    </Stack>
  );
}
