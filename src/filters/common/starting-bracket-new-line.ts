import { TextEditor } from "vscode";
import { Tree } from "web-tree-sitter";
import { TreeCursor } from "web-tree-sitter";

export default function startingBracketNewLine(
  activeEditor: TextEditor,
  biscuitText: string,
  currentNode: TreeCursor,
  tree: Tree
) {
  let newBiscuitText = biscuitText;

  if (biscuitText.indexOf("{") === 0) {
    const previousLineText = activeEditor.document
      .lineAt(currentNode.startPosition.row - 1)
      .text.trim();
    newBiscuitText = `${previousLineText} ${newBiscuitText}`;
  }

  return newBiscuitText;

  // return currentNode.nodeText ?? ""; //?.replace(/[\s]+/gm, " ") ?? "";
}
