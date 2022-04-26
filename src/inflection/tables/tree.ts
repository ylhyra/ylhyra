import { sortByClassification } from "inflection/tables/classification/sortByClassification";
import { Branch, Rows, Tree, TreeItem } from "inflection/tables/types";

/**
 * Turns rows into nested tree, with each leaf containing
 * a collection of items that have the same classification
 */
export const tree = (rows: Rows): Tree => {
  let output: Tree = {
    BIN_id: rows[0]?.BIN_id,
    base_word: rows[0]?.base_word,
    correctness_grade_of_word: rows[0]?.correctness_grade_of_word,
    word_register: rows[0]?.word_register,
    word_categories: rows[0]?.word_categories,
    values: [],
  };

  for (const row of rows) {
    let currentArray: TreeItem[] = output.values;
    for (const tag of row.inflectional_form_categories) {
      const alreadyExists = currentArray.find((i) => i.tag === tag);
      if (alreadyExists) {
        currentArray = (alreadyExists as Branch).values;
      } else if (typeof tag === "number") {
        /* Here, tag is a number, indicating variant. Create leaf. */
        currentArray.push(row);
      } else {
        /* Create branch */
        currentArray.push({
          tag,
          values: [],
        });
        currentArray = currentArray[currentArray.length - 1].values!;
      }
    }
  }

  return traverseAndSort(output) as Tree;
};

/**
 * Sort tree based on the list `sorted_tags` array in ./classification/BIN_classification.js
 */
const traverseAndSort = (input: Tree | TreeItem): Tree | TreeItem => {
  if (input.values) {
    /** Branch */
    return {
      ...input,
      values: input.values.sort(sortByClassification).map(traverseAndSort),
    };
  } else {
    /** Leaf */
    return input;
  }
};

export const isNumber = (input: string | number) => {
  return typeof input === "number"; //|| /^\d+$/.test(input + "");
};
