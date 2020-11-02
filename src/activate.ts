import vscode, { Position, Range, TextDocument as RawTextDocument } from "vscode";
import { createActivate } from "biscuits-base";
import * as validator from "validate.js";

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
  // "css",
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

const languageSettingsConstraints: any = {};

languages.forEach((language: string) => {
  languageSettingsConstraints[`${language}.annotationPrefix`] = {
    type: "string"
  };

  languageSettingsConstraints[`${language}.annotationColor`] = {
    type: "string"

  };

  languageSettingsConstraints[`${language}.annotationMinDistance`] = {
    type: "number",
    numericality: {
      greaterThanOrEqualTo: 0,
    }
  };

  languageSettingsConstraints[`${language}.annotationMaxLength`] = {
    type: "number",
    numericality: {
      greaterThanOrEqualTo: 0,
    }
  };
});

const languageNameConstraints = {
  key: {
    type: "string",
    inclusion: {
      within: languages,
      message: '^"%{value}" is not a supported language.'
    }
  }
};

let hasShownInvalidSettingsWarning = false;
let previousSettingsString = "";

const TreeSitterLanguages: any = {};

const extras = treeSitter.then(async (innerTreeSitter: any) => {
  return Promise.all(
    languages.map((language) => {
      const grammarName = `tree-sitter-${language}`;
      const grammarWasm = `${grammarName}.wasm`;

      return TreeSitter.Language.load(grammarWasm).then(
        (treeSitterLanguage: any) => {
          TreeSitterLanguages[language] = treeSitterLanguage;
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

  const currentSettings: any = vscode.workspace.getConfiguration().get(CONFIG_LANGUAGE_SETTINGS) || {};
  const settingsAreInvalid = validator.validate(currentSettings, languageSettingsConstraints);
  const currentSettingsString = JSON.stringify(currentSettings);

  const namesAreInvalidResults = Object.keys(currentSettings).map(
    (key: any) => {
      return validator.validate({key}, languageNameConstraints);
    }
  );

  const namesAreInvalid = namesAreInvalidResults.some(result => !!result);

  // TODO: handle invalid keys within a valid language

  if(
    (settingsAreInvalid || namesAreInvalid) &&
    !hasShownInvalidSettingsWarning &&
    currentSettingsString !== previousSettingsString
    ) {

      let message = `Assorted Biscuits 🍪 Invalid Settings: `;

      if(namesAreInvalid) {
        message += namesAreInvalidResults.map(validation => validation.key).join(' • ');
      }

      if(namesAreInvalid && settingsAreInvalid) {
        message += ' • ';
      }

      if(settingsAreInvalid) {
        message += Object.values(settingsAreInvalid).join(' • ');
      }

      console.log("SETTINGS INVALID: ", JSON.stringify(settingsAreInvalid));

      vscode.window.showWarningMessage(message);
    }

  previousSettingsString = currentSettingsString;

  if (!TreeSitterLanguages[editorLanguage]) {
    return [];
  }

  const macroStartRegex = /^\w*\#\[/gm;
  const scrubbedText = text.replace(macroStartRegex, '//');

  innerTreeSitter.setLanguage(TreeSitterLanguages[editorLanguage]);
  const parsedText = (innerTreeSitter as TreeSitter).parse(scrubbedText);

  let decorations: any[] = [];

  const biscuitsByFreshness: any = {};
  const biscuitsByStaleness: any = {};

  let nodes = parsedText.rootNode.children;
  let children: any[] = [];
  while (nodes.length > 0) {

    nodes.forEach((node: TreeSitter.SyntaxNode) => {
      if (node.children.length > 0) {
        children = [...children, ...node.children];
      }

      let startLine = node.startPosition.row;
      const endLine = node.endPosition.row;

      let contentText = "";

      contentText = activeEditor.document.lineAt(node.startPosition.row).text.trim();

      if(contentText.charAt(0) === '{') {
        contentText = node.text.replace(/(\r|\n|\r\n|\s)+/gm, " ");
      }

      if(
        node?.nextSibling?.type === ".") {
        contentText = '';
      }

      if(node?.nextSibling?.type === 'argument_list') {
        contentText = '';
      }

      let maxLength: number =
        vscode.workspace.getConfiguration().get(CONFIG_MAX_LENGTH) || 0;

      // if(settingsAreInvalid[]) {

      // }

      if (maxLength && contentText.length > maxLength) {
        contentText = contentText.substr(0, maxLength) + "...";
      }

      const endOfLine = activeEditor.document.lineAt(endLine).range.end;

      contentText = contentText.trim();

      if (endLine && endLine - startLine >= minDistance && contentText && startLine != endLine) {

        if(node?.previousSibling?.type === "member_access_expression") {

          biscuitsByFreshness[endLine] = {
            range: new vscode.Range(
              activeEditor.document.positionAt(node.startIndex),
              endOfLine
            ),
            renderOptions: {
              after: {
                contentText: `${prefix} ${contentText}`,
              },
            },
          };
        } else if(!biscuitsByStaleness[endLine]) {

          biscuitsByStaleness[endLine] = true;

          decorations.push({
            range: new vscode.Range(
              activeEditor.document.positionAt(node.startIndex),
              endOfLine
            ),
            renderOptions: {
              after: {
                contentText: `${prefix} ${contentText}`,
              },
            },
          });
        }
      }
    });
    nodes = children;
    children = [];
  }

  decorations = [
    ...Object.values(biscuitsByFreshness),
    ...decorations
  ];

  return decorations;
}