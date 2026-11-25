import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { specProjects } from "../../spec";
import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { SpecEditor } from "../../parts/spec-editor";
import { Stack } from "../../parts/stack";

type SpecProject = (typeof specProjects)[number];
type SpecFile = SpecProject["files"][number];

const projects: SpecProject[] = ["tictactoe", "site"]
  .map((key) => specProjects.find((p) => p.key === key))
  .filter((p): p is SpecProject => p !== undefined);

const folderOf = (path: string): string => {
  const index = path.lastIndexOf("/");
  return index >= 0 ? path.slice(0, index) : "";
};

const nameOf = (path: string): string => path.slice(path.lastIndexOf("/") + 1);

const slashes = (path: string): number => path.split("/").length - 1;

/** "two projects can be browsed: the Tic-Tac-Toe demo and this website; the demo is shown first" */
export function SpecBrowser() {
  const [project, setProject] = useState<string>("tictactoe");
  const [file, setFile] = useState<string>("tictactoe.ail.md");

  useEffect(() => {
    const open = (hash: string): void => {
      if (!hash.startsWith("#spec/")) {
        return;
      }
      const rest = hash.slice("#spec/".length);
      const index = rest.indexOf("/");
      if (index < 0) {
        return;
      }
      const key = rest.slice(0, index);
      const path = rest.slice(index + 1);
      const found = projects.find((p) => p.key === key);
      if (!found || !found.files.some((f) => f.path === path)) {
        return;
      }
      setProject(key);
      setFile(path);
      document.getElementById("specs")?.scrollIntoView();
    };
    const onHashChange = (): void => {
      open(window.location.hash);
    };
    const onClick = (event: MouseEvent): void => {
      const target = event.target;
      const anchor = target instanceof Element ? target.closest("a") : null;
      const href = anchor ? anchor.getAttribute("href") : null;
      if (href !== null && href.startsWith("#spec/")) {
        open(href);
      }
    };
    open(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const shown = projects.find((p) => p.key === project) ?? projects[0];
  const files: SpecFile[] = shown ? shown.files : [];
  const picked = files.find((f) => f.path === file);

  const pickProject = (next: SpecProject): void => {
    if (next.key === project) {
      return;
    }
    setProject(next.key);
    const first = next.files[0];
    if (first) {
      setFile(first.path);
    }
  };

  const rows: ReactNode[] = [];
  let previous = "";
  files.forEach((f) => {
    const folder = folderOf(f.path);
    if (folder !== previous && folder !== "") {
      const depth = slashes(folder) + 1;
      rows.push(
        <div
          key={`folder:${f.path}`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--font-tiny)",
            color: "var(--color-code-muted)",
            paddingTop: "var(--space-1)",
            paddingRight: "var(--space-3)",
            paddingBottom: "var(--space-1)",
            paddingLeft: `calc(var(--space-3) + ${12 * (depth - 1)}px)`,
          }}
        >
          {`${folder}/`}
        </div>,
      );
    }
    previous = folder;
    const isPicked = f.path === file;
    rows.push(
      <button
        key={`file:${f.path}`}
        type="button"
        aria-label={f.path}
        title={f.path}
        aria-pressed={isPicked}
        onClick={() => setFile(f.path)}
        style={{
          display: "block",
          width: "100%",
          textAlign: "left",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--font-tiny)",
          color: "var(--color-code-text)",
          background: isPicked ? "var(--color-code-pick)" : "transparent",
          borderTop: "none",
          borderRight: "none",
          borderBottom: "none",
          borderLeft: isPicked
            ? "2px solid var(--color-accent)"
            : "2px solid transparent",
          paddingTop: "var(--space-1)",
          paddingRight: "var(--space-3)",
          paddingBottom: "var(--space-1)",
          paddingLeft: `calc(var(--space-3) + ${12 * slashes(f.path)}px)`,
          cursor: "pointer",
        }}
      >
        {nameOf(f.path)}
      </button>,
    );
  });

  const groups: { folder: string; files: SpecFile[] }[] = [];
  files.forEach((f) => {
    const folder = folderOf(f.path);
    const last = groups[groups.length - 1];
    if (last && last.folder === folder) {
      last.files.push(f);
    } else {
      groups.push({ folder, files: [f] });
    }
  });

  const options: ReactNode[] = groups.map((group) => {
    const items = group.files.map((f) => (
      <option key={f.path} value={f.path}>
        {f.path}
      </option>
    ));
    if (group.folder === "") {
      return items;
    }
    return (
      <optgroup key={`group:${group.files[0]?.path ?? group.folder}`} label={`${group.folder}/`}>
        {items}
      </optgroup>
    );
  });

  return (
    <Section id="specs" tone="raised">
      <Stack dir="v" gap="space.6" align="stretch">
        <SectionHeading
          eyebrow="Dogfooding"
          text="Browse the specs"
          lead="Read both example specs the way you read code: the Tic-Tac-Toe demo, and this website itself, which is written in AIL and compiled by ail build too. The files come straight from the specs at build time, so they are always current."
        />
        <div
          style={{
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            border: "1px solid var(--color-code-border)",
            background: "var(--color-code)",
            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "var(--space-3)",
              padding: "var(--space-1) var(--space-3)",
              background: "var(--color-code-bar)",
              borderBottom: "1px solid var(--color-code-border)",
            }}
          >
            <div aria-hidden="true" style={{ display: "flex", gap: "6px" }}>
              <span
                style={{
                  display: "block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "var(--radius-pill)",
                  background: "var(--color-dot-red)",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "var(--radius-pill)",
                  background: "var(--color-dot-amber)",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "var(--radius-pill)",
                  background: "var(--color-dot-green)",
                }}
              />
            </div>
            <div
              role="group"
              aria-label="Projects"
              style={{ display: "flex", gap: "var(--space-1)" }}
            >
              {projects.map((p) => {
                const isShown = shown !== undefined && p.key === shown.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    aria-pressed={isShown}
                    onClick={() => pickProject(p)}
                    style={{
                      fontSize: "var(--font-small)",
                      fontWeight: 600,
                      minHeight: "44px",
                      padding: "var(--space-1) var(--space-3)",
                      borderRadius: "var(--radius-md)",
                      border: "none",
                      background: isShown
                        ? "var(--color-code-pick)"
                        : "transparent",
                      color: isShown
                        ? "var(--color-code-text)"
                        : "var(--color-code-muted)",
                      cursor: "pointer",
                    }}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
            <p
              className="ail-wide"
              style={{
                margin: "0 0 0 auto",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--font-tiny)",
                color: "var(--color-code-muted)",
              }}
            >
              {`${shown ? shown.nodeCount : 0} nodes in ${files.length} files`}
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <select
              className="ail-narrow"
              aria-label="Spec files"
              value={file}
              onChange={(event) => setFile(event.target.value)}
              style={{
                width: "100%",
                minHeight: "44px",
                boxSizing: "border-box",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--font-small)",
                color: "var(--color-code-text)",
                background: "var(--color-code-side)",
                borderTop: "none",
                borderRight: "none",
                borderLeft: "none",
                borderBottom: "1px solid var(--color-code-border)",
                padding: "var(--space-2) var(--space-3)",
              }}
            >
              {options}
            </select>
            <nav
              className="ail-wide"
              aria-label="Spec files"
              style={{
                flex: "1 1 220px",
                maxHeight: "clamp(200px, 40vw, 560px)",
                overflowY: "auto",
                background: "var(--color-code-side)",
                padding: "var(--space-2) 0",
                boxSizing: "border-box",
              }}
            >
              {rows}
            </nav>
            <div
              style={{
                flex: "999 1 420px",
                minWidth: 0,
                maxWidth: "100%",
                overflow: "hidden",
                height: "clamp(380px, 120vw, 560px)",
              }}
            >
              <SpecEditor
                text={picked ? picked.text : ""}
                path={`${shown ? shown.key : project}/${file}`}
                label={`Source of ${file}`}
              />
            </div>
          </div>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "var(--font-body)",
            lineHeight: 1.6,
            color: "var(--color-text-muted)",
            maxWidth: "var(--width-prose)",
          }}
        >
          {"Every section, the notation for types and values, and the rules ail build enforces are in "}
          <a
            href="https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/language.md"
            style={{
              color: "var(--color-accent)",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            the language definition
          </a>
          {". A spec never uses a programming language's syntax: each compiler translates it into its target's own conventions."}
        </p>
      </Stack>
    </Section>
  );
}
