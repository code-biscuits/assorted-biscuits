import * as vscode from "vscode";

export interface ServiceWrapper {
  createDecorations(
    documentText: string,
    activeEditor: vscode.TextEditor,
    prefix: string,
    minDistance: number,
    shouldHideBiscuits: boolean,
    cursorLineOnly: boolean,
    cursorLines: number[],
    context?: vscode.ExtensionContext,
    document?: vscode.TextDocument
  ): Promise<any[]>;
}

let decorationType: vscode.TextEditorDecorationType;
const toggleCommand = "assorted-biscuits.toggleBiscuitsShowing";
let shouldHideBiscuits = false;
let cursorLines: number[] = [];

export function createActivate(
  CONFIG_COLOR_KEY: string,
  CONFIG_DISTANCE_KEY: string,
  CONFIG_PREFIX_KEY: string,
  CONFIG_CURSOR_LINE_ONLY: string,
  service: ServiceWrapper
) {
  return function (context: vscode.ExtensionContext) {
    //  abstractable
    let decorations: vscode.DecorationOptions[] = [];
    let activeEditor = vscode.window.activeTextEditor;
    let color: string | undefined = vscode.workspace
      .getConfiguration()
      .get(CONFIG_COLOR_KEY);

    let currentSettings: any = vscode.workspace
      .getConfiguration()
      .get("assorted-biscuits.languageSettings");

    let editorLanguage = activeEditor?.document.languageId || "";
    let languageSettings = currentSettings[editorLanguage];

    if (decorationType) {
      decorationType.dispose();
    }

    // abstractable
    decorationType = vscode.window.createTextEditorDecorationType({
      after: {
        color: color || new vscode.ThemeColor("editorLineNumber.foreground"),
        margin: "2px",
      },
      rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
    });

    context.subscriptions.push(
      vscode.commands.registerCommand(toggleCommand, () => {
        shouldHideBiscuits = !shouldHideBiscuits;
        let currentActiveEditor = vscode.window.activeTextEditor;
        if (currentActiveEditor) {
          updateDecorations(currentActiveEditor.document);
        }
      })
    );

    async function updateDecorations(document: vscode.TextDocument) {
      decorations = [];

      if (shouldHideBiscuits) {
        activeEditor?.setDecorations(decorationType, []);
        return;
      }

      currentSettings = vscode.workspace
        .getConfiguration()
        .get("assorted-biscuits.languageSettings");

      const newLanguageColor =
        (languageSettings && languageSettings["annotationColor"]) || color;

      editorLanguage = document?.languageId || "";
      languageSettings = currentSettings[editorLanguage];
      const prefix: string =
        vscode.workspace.getConfiguration().get(CONFIG_PREFIX_KEY) || "// ";
      const minDistance: number =
        vscode.workspace.getConfiguration().get(CONFIG_DISTANCE_KEY) || 0;
      const cursorLineOnly: boolean =
        vscode.workspace.getConfiguration().get(CONFIG_CURSOR_LINE_ONLY) ||
        false;

      if (color !== newLanguageColor) {
        decorationType.dispose();

        color = newLanguageColor;
        decorationType = vscode.window.createTextEditorDecorationType({
          after: {
            color:
              color || new vscode.ThemeColor("editorLineNumber.foreground"),
            margin: "2px",
          },
          rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
        });
      }

      if (document && activeEditor) {
        decorations = await service.createDecorations(
          document.getText(),
          activeEditor,
          prefix,
          minDistance,
          shouldHideBiscuits,
          cursorLineOnly,
          cursorLines,
          context,
          document
        );
      }

      // activeEditor?.setDecorations(decorationType, []);

      if (decorations.length > 0) {
        activeEditor?.setDecorations(decorationType, decorations);
      } else {
        activeEditor?.setDecorations(decorationType, []);
      }
    }

    if (activeEditor) {
      updateDecorations(activeEditor.document);
    }

    vscode.window.onDidChangeActiveTextEditor(
      (editor) => {
        activeEditor = editor;
        if (editor) {
          updateDecorations(editor.document);
        }
      },
      null,
      context.subscriptions
    );

    vscode.window.onDidChangeTextEditorSelection((cursorLocationEvent) => {
      cursorLines = cursorLocationEvent.selections.map(
        (cursorLocation) => cursorLocation.end?.line ?? 0
      );
      if (activeEditor) {
        updateDecorations(activeEditor.document);
      }
    });

    vscode.workspace.onDidChangeTextDocument(
      (event) => {
        updateDecorations(event.document);
      },
      null,
      context.subscriptions
    );
  };
}
