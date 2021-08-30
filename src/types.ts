import { TextEditor } from "vscode";
import { Tree, TreeCursor } from "web-tree-sitter";

export type LanguageFilter = (
  activeEditor: TextEditor,
  biscuitText: string,
  currentNode: TreeCursor,
  tree: Tree
) => string;
