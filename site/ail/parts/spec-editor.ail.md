# Spec editor

A read-only code editor (Monaco, the editor inside VS Code) for spec files.
Monaco loads from a CDN at runtime; until then, and wherever it cannot load,
the same text is shown as a plain code block.

```ail
node SpecEditor : view   level: experience
  why   Specs are read like code, so they are shown in the editor developers already know, and never changed there.   <- Parts
  what
    shows the given text in a read-only code editor with AIL colours, line numbers and wrapped lines
    while the editor is loading, or wherever it cannot load, the same text is shown as a plain code block, so the text is always readable
    the text can be selected and copied, never changed
    Scenario: readable before the editor loads
      Given the text "node A : fn   level: system" and the label "Source of a.ail.md"
      Then the region named "Source of a.ail.md" contains "node A : fn   level: system"
  look
    box       a div: width 100%, max-width 100%, min-width 0, height 100%, min-height 320px, overflow hidden, background color.code
    editor    the Monaco editor filling the box, theme "ail-dark"
    fallback  CodeBlock with the text's lines and the label, inside a div with height 100% and overflow-y auto
  binds
    props     text: text, path: text, label: text
    lines     the text split on line breaks, without a trailing empty line
    editor    the default export Editor of @monaco-editor/react with value = text, path = "ail:" + path, language "ail", theme "ail-dark", height "100%", loading = the fallback, and options: readOnly true, domReadOnly true, minimap enabled false, wordWrap "on", lineNumbers "on", lineNumbersMinChars 3, glyphMargin false, folding false, lineDecorationsWidth 8, scrollBeyondLastLine false, fontSize 13, fontFamily "Inconsolata, ui-monospace, monospace", renderLineHighlight "none", automaticLayout true, padding top 12 and bottom 12, ariaLabel = label
    language  in beforeMount, only if no registered language has the id "ail": register the language "ail" and set its Monarch tokenizer to one root state with these rules, in this order:
                /^#.*$/ → "keyword.md"
                /^```.*$/ → "comment"
                /^;.*$/ → "comment" (a line that starts with ";")
                /\s;.*$/ → "comment" (a ";" after whitespace, to the end of the line; a ";" right after a word is ordinary text, as in AIL itself)
                /"[^"]*"/ → "string"
                /<-\s*\w+/ → "type"
                /refined-by:/ → "type"
                /^(node)(\s+)(\w+)/ → the groups "keyword", "white", "type.identifier"
                /^(target|catalog|glossary)\b/ → "keyword"
                /^\s+(why|what|how|look|copy|binds|free|uses|children|verify|entry|tokens|term|decide|because|rejected|examples|probes)\b/ → "keyword"
                /Scenario:/ → "tag"
                /\b(Given|When|Then|And)\b/ → "tag"
                /\blevel:\s*\w+/ → "attribute.name"
                /@\w+/ → "attribute.name"
                /=>/ → "operator"
              there is no rule for other capitalised words, so prose keeps the default colour
    theme     also in beforeMount: define the theme "ail-dark" with base "vs-dark", inherit true, rules keyword #fbbf24 bold, keyword.md #f6ead6 bold, comment #8a7259, string #fde68a, type #a3e635, type.identifier #fdba74, tag #f9a8d4, attribute.name #fca5a5, operator #f6ead6, and colors editor.background #1b120a, editorLineNumber.foreground #6b5340, editorGutter.background #1b120a (the stout panel of the ale palette)
  uses  CodeBlock
```
