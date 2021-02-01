import * as vscode from "vscode";

export interface ServiceWrapper {
  createDecorations(
    documentText: string,
    activeEditor: vscode.TextEditor,
    prefix: string,
    minDistance: number,
    context?: vscode.ExtensionContext,
    document?: vscode.TextDocument
  ): Promise<any[]>;
}

let decorationType: vscode.TextEditorDecorationType;

export function createActivate(
  CONFIG_COLOR_KEY: string,
  CONFIG_DISTANCE_KEY: string,
  CONFIG_PREFIX_KEY: string,
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

    console.log("LANGUAGE in createActivate: ", editorLanguage);

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

    async function updateDecorations(document: vscode.TextDocument) {
      decorations = [];

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
          context,
          document
        );
      }

      // activeEditor?.setDecorations(decorationType, []);

      if (decorations.length > 0) {
        activeEditor?.setDecorations(decorationType, decorations);
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

    vscode.workspace.onDidChangeTextDocument(
      (event) => {
        updateDecorations(event.document);
      },
      null,
      context.subscriptions
    );
  };
}
