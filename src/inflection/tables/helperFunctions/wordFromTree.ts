import {
  TreeItem,
  TreeItems,
  Row,
  Rows,
  Tree,
  Leafs,
  Leaf,
} from "inflection/tables/types";
import Word from "inflection/tables/word";

/**
 * Used by RenderTable
 */
export const wordFromTree = (
  input: Tree | TreeItem | TreeItems,
  original: Word
) => {
  let rows: Leafs = [];
  const traverse = (x: Tree | TreeItem | TreeItems) => {
    if (Array.isArray(x)) {
      x.map(traverse);
    } else if (x.values) {
      x.values.map(traverse);
    } else {
      rows.push(x as unknown as Leaf);
    }
  };
  traverse(input);
  return new Word(rows, original);
};
