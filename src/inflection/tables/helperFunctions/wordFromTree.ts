import { Leaf, Leafs, Row, Rows, Tree } from "inflection/tables/types";
import Word from "inflection/tables/word";

/**
 * Used by RenderTable
 */
export const wordFromTree = (input: Tree | Leaf | Leafs, original: Word) => {
  let rows: Leaf[] = [];
  const traverse = (x: Tree | Leaf | Leafs) => {
    if (Array.isArray(x)) {
      x.map(traverse);
    } else if (x.values.length > 0) {
      x.values.map(traverse);
    } else {
      rows.push(x as unknown as Leaf);
    }
  };
  traverse(input);
  return new Word(rows, original);
};
