import vscode, { Range, TextDocument as RawTextDocument } from "vscode";
import { createActivate } from "biscuits-base";

// @ts-ignore
import TreeSitter = require("../deps/tree-sitter");

const treeSitter = TreeSitter.init().then(() => {
  return new TreeSitter();
});

const languages = [
  // "agda", // does it even make sense here
  // "bash", // failed
  "csharp",
  "c",
  // "cpp", //failed
  "css",
  "elm",
  // "embedded_template", //failed
  "go",
  // "html", //failed
  "java",
  // "javascript", // ignored until we have typescript here
  "json",
  "lua",
  "kotlin",
  // "markdown", //failed
  "php",
  "python",
  // "ruby", //failed
  "rust",
  // "systemrdl", //failed
  "toml",
  // "vue", //failed
  "yaml",
];

const TreeSitterLanguages: any = {};

const extras = treeSitter.then(async (innerTreeSitter: any) => {
  return Promise.all(
    languages.map((language) => {
      const grammarName = `tree-sitter-${language}`;
      const grammarWasm = `${grammarName}.wasm`;

      return TreeSitter.Language.load(grammarWasm).then(
        (treeSitterLanguage: any) => {
          TreeSitterLanguages[language] = treeSitterLanguage;

          // innerTreeSitter.setLanguage(treeSitterLanguage);
        }
      );
    })
  );
});

// Needs to be genericized
const CONFIG_PREFIX_KEY = "assorted-biscuits.annotationPrefix";
const CONFIG_COLOR_KEY = "assorted-biscuits.annotationColor";
const CONFIG_DISTANCE_KEY = "assorted-biscuits.annotationMinDistance";
const CONFIG_MAX_LENGTH = "assorted-biscuits.annotationMaxLength";
const CONFIG_LANGUAGE_SETTINGS = "assorted-biscuits.languageSettings";

let runningActivation: Promise<any>;

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
      try {
      const innerTreeSitter = await treeSitter;
      await extras;

      return _createDecorations(
        text,
        activeEditor,
        minDistance,
        prefix,
        innerTreeSitter
      );

    } catch (error) {
      console.log('error', error);
      return [];
    }
    },
  }
);

function _createDecorations(
  text: string,
  activeEditor: vscode.TextEditor,
  minDistance: number,
  prefix: string,
  innerTreeSitter: any,
) {
  const editorLanguage = activeEditor.document.languageId;

  if (!TreeSitterLanguages[editorLanguage]) {
    return [];
  }
  innerTreeSitter.setLanguage(TreeSitterLanguages[editorLanguage]);
  const parsedText = (innerTreeSitter as TreeSitter).parse(text);

  const decorations: any[] = [];
  let nodes = parsedText.rootNode.children;
  console.log('nodes', parsedText.rootNode.children.map((child: any) => JSON.stringify(child, undefined, 2)));
  let children: any[] = [];
  while (nodes.length > 0) {

    nodes.forEach((node: TreeSitter.SyntaxNode, index: number) => {
      if (node.children.length > 0) {
        children = [...children, ...node.children];
      }


      let startLine = node.startPosition.row;
      const endLine = node.endPosition.row;

      let contentText = "";

      const text = node.text.trim();
      contentText = text.replace(/(\r|\n|\r\n)/gm, "");

      if(node?.previousSibling?.type === "member_access_expression") {
        contentText = node.previousSibling.lastChild.text.replace(/(\r|\n|\r\n)/gm, "");
      }

      let maxLength: number =
        vscode.workspace.getConfiguration().get(CONFIG_MAX_LENGTH) || 0;

      if (maxLength && contentText.length > maxLength) {
        contentText = contentText.substr(0, maxLength) + "...";
      }

      const endOfLine = activeEditor.document.lineAt(endLine).range.end;

      if (endLine && endLine - startLine >= minDistance && contentText && startLine != endLine) {
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
    children = [];
  }

  return decorations;
}