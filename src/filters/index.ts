import { TextEditor } from "vscode";
import { Tree, TreeCursor } from "web-tree-sitter";
import { LanguageFilter } from "../types";
import startingBracketNewLine from "./common/starting-bracket-new-line";

const filtersByLanguage: { [key: string]: LanguageFilter[] } = {
  json: [],
};

const defaultFilters: LanguageFilter[] = [startingBracketNewLine];

export function filterBiscuit(
  activeEditor: TextEditor,
  language: string,
  biscuitText: string,
  currentNode: TreeCursor,
  tree: Tree
) {
  let newBiscuitText = biscuitText;

  const filters = filtersByLanguage[language] ?? defaultFilters;

  filters.forEach((filter) => {
    newBiscuitText = filter(activeEditor, newBiscuitText, currentNode, tree);
  });

  return newBiscuitText;
}
