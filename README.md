# Assorted Biscuits

Use assorted-biscuits to make code soup and spaghetti more digestible. Annotate ALL the end brackets!!!

Watch the text by the end brackets to see Biscuits in action.

![](example.gif)

Note: The explosion you see is [Power Mode](https://marketplace.visualstudio.com/items?itemName=hoovercj.vscode-power-mode)

## Supported Languages

Assorted Biscuits is named as such because it handles multiple languages. This functionality is provided by [Tree Sitter](https://github.com/tree-sitter/tree-sitter).

- C
- C#
- Elm
- Go
- Java
- JSON
- Kotlin
- Lua
- PHP
- Python
- Rust
- TOML
- YAML

We can add more as their grammars are made available as WebAssembly.

## Roadmap

Until we can bring HTML, SCSS, and TS into this repo, we will continue to maintain those other extensions seperately.

## Warning! Potential Plugin Conflict

In the current implementation, code-biscuits prevent seeing GitLens annotations. Issue can be tracked here:
[https://github.com/code-biscuits/html-biscuits/issues/2](https://github.com/code-biscuits/html-biscuits/issues/2)

The HTML extension getting fixed will be the blueprint for fixing other extensions in the same way.

## Global Configuration

- `assorted-biscuits.annotationColor` _string_ : Determines the color of annotation. Accepts any valid CSS color string.

  - default: `vscode.ThemeColor("editorLineNumber.foreground")`,

- `assorted-biscuits.annotationPrefix` _string_ : Determines beginning of the annotation text. Emoji are allowed. Empty string is also acceptable.

  - default: `"// "`,

- `assorted-biscuits.annotationMinDistance` _number_ : Determines the minimum amount of lines between start and end tag used to decide to show the annotations.

  - default: `0`,

- `assorted-biscuits.annotationMaxLength` _number_ : What is the longest annotation you should see before we cut it off with a `...`? A `0` value shows the full string.
  - default: `42`,

- `assorted-biscuits.languageSettings` _object_: Per-language configuration to allow each language to feel unique. See "Language Specific Configuration" below.

## Language Specific Configuration

You can configure each setting above to be specific to each language. To do so, use `cmd + shift + p` to bring up the VSCode command pallette. Search for "Configure Individual Language Settings". Using the command will show a webview UI.

![](assorted-config.gif)

The settings above will take precedent over the global settings when using that specific language.

You can also just use the settings.json to modify language settings:
```

  "assorted-biscuits.languageSettings": {
    "rust": {
      "annotationPrefix": "🦀 ",
      "annotationMaxLength": "10",
      "annotationMinDistance": "1",
      "annotationColor": "#97f684"
    },
    "php": {
      "annotationPrefix": "🐘 ",
      "annotationColor": "#ff0000",
      "annotationMaxLength": "4",
      "annotationMinDistance": "1"
    }
  }
```

We do our best to validate your per-language configuration if you decide to edit it manually.

## Release Notes

### 0.0.15

- styling updates to per-language settings UI
- debounce input events in settings UI
- fixed per-language settings validation bugs

### 0.0.14

- change settings UI change listener events to be more responsive

## Attributions

- Logo: biscuit by Bartama Graphic from the Noun Project

## License

Copyright 2020 code-biscuits

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
