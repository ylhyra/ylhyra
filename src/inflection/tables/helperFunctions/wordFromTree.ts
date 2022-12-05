import { Row, Rows, Tree, TreeItem, TreeItems } from "inflection/tables/types";
import Word from "inflection/tables/word";

/** Used by RenderTable */
export function wordFromTree(
  input: Tree | TreeItem | TreeItems,
  original: Word,
): Word {
  let rows: Rows = [];
  const traverse = (x: Tree | TreeItem | TreeItems) => {
    if (Array.isArray(x)) {
      x.map(traverse);
    } else if (x.values) {
      x.values.map(traverse);
    } else {
      rows.push(x as unknown as Row);
    }
  };
  traverse(input);
  return new Word(rows, original);
}
