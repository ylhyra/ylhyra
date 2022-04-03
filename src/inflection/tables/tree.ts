import { sortByClassification } from "inflection/tables/classification/sort_by_classification";
import { Leaf, Rows, Tree } from "inflection/tables/types";

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
    let currentArray: Leaf[] = output.values;
    for (const tag of row.inflectional_form_categories) {
      const alreadyExists = currentArray.find((i) => i.tag === tag);
      if (alreadyExists) {
        currentArray = alreadyExists.values;
      } else if (isNumber(tag)) {
        /* Here, tag is a number, indicating variant. */
        currentArray.push({
          inflectional_form_categories: row.inflectional_form_categories,
          word_categories: row.word_categories,
          variant_number: parseInt(tag),
          inflectional_form: row.inflectional_form,
          should_be_taught: row.should_be_taught,
          correctness_grade_of_inflectional_form:
            row.correctness_grade_of_inflectional_form,
          register_of_inflectional_form: row.register_of_inflectional_form,
          formattedOutput: row.formattedOutput,
          values: [],
          // various_feature_markers: row.various_feature_markers,
        });
      } else {
        currentArray.push({
          tag,
          values: [],
        });
        currentArray = currentArray[currentArray.length - 1].values;
      }
    }
  }

  return traverseAndSort(output) as Tree;
};

/**
 * Sort tree based on the list `sorted_tags` array in ./classification/BIN_classification.js
 */
const traverseAndSort = (input: Tree | Leaf): Tree | Leaf => {
  // if (Array.isArray(input)) {
  //   return input.sort(sort_by_classification).map(TraverseAndSort);
  // } else if (input.values) {
  // console.log(input.values.slice(0,3))
  return {
    ...input,
    values: input.values.sort(sortByClassification).map(traverseAndSort),
  };
  // } else {
  //   return input;
  // }
};

export const isNumber = (input: string | number) => {
  return typeof input === "number" || /^\d+$/.test(input + "");
};
