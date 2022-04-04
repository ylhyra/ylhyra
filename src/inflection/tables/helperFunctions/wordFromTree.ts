import { Leaf, Leafs, Row, Rows, Tree } from "inflection/tables/types";
import Word from "inflection/tables/word";

/**
 * Used by RenderTable
 */
export const wordFromTree = (input: Tree | Leaf | Leafs, original: Word) => {
  let rows: Rows = [];
  const traverse = (x: Tree | Leaf | Leafs) => {
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
};
