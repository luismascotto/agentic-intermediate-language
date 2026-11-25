import Editor from "@monaco-editor/react";
import type { BeforeMount } from "@monaco-editor/react";
import { CodeBlock } from "./code-block";

export type SpecEditorProps = {
  text: string;
  path: string;
  label: string;
};

const beforeMount: BeforeMount = (monaco) => {
  if (!monaco.languages.getLanguages().some((language) => language.id === "ail")) {
    monaco.languages.register({ id: "ail" });
    monaco.languages.setMonarchTokensProvider("ail", {
      tokenizer: {
        root: [
          [/^#.*$/, "keyword.md"],
          [/^```.*$/, "comment"],
          [/^;.*$/, "comment"],
          [/\s;.*$/, "comment"],
          [/"[^"]*"/, "string"],
          [/<-\s*\w+/, "type"],
          [/refined-by:/, "type"],
          [/^(node)(\s+)(\w+)/, ["keyword", "white", "type.identifier"]],
          [/^(target|catalog|glossary)\b/, "keyword"],
          [
            /^\s+(why|what|how|look|copy|binds|free|uses|children|verify|entry|tokens|term|decide|because|rejected|examples|probes)\b/,
            "keyword",
          ],
          [/Scenario:/, "tag"],
          [/\b(Given|When|Then|And)\b/, "tag"],
          [/\blevel:\s*\w+/, "attribute.name"],
          [/@\w+/, "attribute.name"],
          [/=>/, "operator"],
        ],
      },
    });
  }
  monaco.editor.defineTheme("ail-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "fbbf24", fontStyle: "bold" },
      { token: "keyword.md", foreground: "f6ead6", fontStyle: "bold" },
      { token: "comment", foreground: "8a7259" },
      { token: "string", foreground: "fde68a" },
      { token: "type", foreground: "a3e635" },
      { token: "type.identifier", foreground: "fdba74" },
      { token: "tag", foreground: "f9a8d4" },
      { token: "attribute.name", foreground: "fca5a5" },
      { token: "operator", foreground: "f6ead6" },
    ],
    colors: {
      "editor.background": "#1b120a",
      "editorLineNumber.foreground": "#6b5340",
      "editorGutter.background": "#1b120a",
    },
  });
};

/** shows the given text in a read-only code editor with AIL colours, line numbers and wrapped lines */
export function SpecEditor({ text, path, label }: SpecEditorProps) {
  const lines = text.split(/\r?\n/);
  if (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }
  const fallback = (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <CodeBlock lines={lines} label={label} />
    </div>
  );
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        height: "100%",
        minHeight: "320px",
        overflow: "hidden",
        background: "var(--color-code)",
      }}
    >
      <Editor
        value={text}
        path={"ail:" + path}
        language="ail"
        theme="ail-dark"
        height="100%"
        loading={fallback}
        beforeMount={beforeMount}
        options={{
          readOnly: true,
          domReadOnly: true,
          minimap: { enabled: false },
          wordWrap: "on",
          lineNumbers: "on",
          lineNumbersMinChars: 3,
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 8,
          scrollBeyondLastLine: false,
          fontSize: 13,
          fontFamily: "Inconsolata, ui-monospace, monospace",
          renderLineHighlight: "none",
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          ariaLabel: label,
        }}
      />
    </div>
  );
}
