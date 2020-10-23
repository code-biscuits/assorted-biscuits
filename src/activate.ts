import vscode, { Range, TextDocument as RawTextDocument } from "vscode";
import { createActivate } from "biscuits-base";

// @ts-ignore
import TreeSitter = require("../deps/tree-sitter");

const treeSitter = TreeSitter.init().then(() => {
  return new TreeSitter();
});

const extras = treeSitter.then(async (innerTreeSitter: any) => {
  const Lang =await TreeSitter.Language.load(
    "tree-sitter-c_sharp.wasm"
  );
  innerTreeSitter.setLanguage(Lang);
});

// Needs to be genericized
const CONFIG_PREFIX_KEY = "csharp-biscuits.annotationPrefix";
const CONFIG_COLOR_KEY = "csharp-biscuits.annotationColor";
const CONFIG_DISTANCE_KEY = "csharp-biscuits.annotationMinDistance";
const CONFIG_MAX_LENGTH = "csharp-biscuits.annotationMaxLength";

export const activate = createActivate(
  CONFIG_COLOR_KEY,
  CONFIG_DISTANCE_KEY,
  CONFIG_PREFIX_KEY,
  {
    async createDecorations(
      text: string,
      activeEditor: vscode.TextEditor,
      prefix: string,
      minDistance: number
    ) {
      const innerTreeSitter = await treeSitter;
      await extras;
      const parsedText = (innerTreeSitter as TreeSitter).parse(text);

      console.log("Original text", text);
      console.log("Parsed Text", parsedText);
      console.log('Root',
      parsedText.rootNode.children.map((node: TreeSitter.SyntaxNode) => {
        return node.endPosition
      })
      );



      const decorations: any[] = [];
      let nodes = parsedText.rootNode.children;
      let children: any[] = [];
      while(nodes.length > 0) {
        nodes.forEach((node: TreeSitter.SyntaxNode) => {

          if(node.children.length > 0) {
            children = [...children, ...node.children];
          }

          const startLine = node.startPosition.row;
          const endLine = node.endPosition.row;

          let contentText = "";

          const text = node.text.trim();
          if(text.charAt(0) !== '{' && text.charAt(0) !== '(') {
            contentText = text;
          }

          let maxLength: number =
            vscode.workspace.getConfiguration().get(CONFIG_MAX_LENGTH) || 0;

          if (maxLength && contentText.length > maxLength) {
            contentText = contentText.substr(0, maxLength) + "...";
          }

          const endOfLine = activeEditor.document.lineAt(endLine).range.end;

          if (endLine - startLine >= minDistance && contentText) {
            decorations.push({
              range: new vscode.Range(
                activeEditor.document.positionAt(endLine),
                endOfLine
              ),
              renderOptions: {
                after: {
                  contentText: `${prefix} ${contentText}`,
                },
              },
            });
          }

        });
        nodes = children;
        children = []
      }

      return decorations;
    },
  }
);
