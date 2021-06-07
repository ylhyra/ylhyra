import { sort_by_classification } from 'tables/classification/sort_by_classification'

/**
 * Turns rows into nested tree, with each leaf containing
 * a collection of items that have the same classification
 *
 * @param {array} rows - Raw list of rows with classifications from ./classification/BIN_classification.js
 * @returns {object}
 * The tree is on the form:
 *   {
 *     values: [{
 *       tag: 'singular',
 *       values: [{
 *         tag: 'nominative',
 *         values: []
 *       }]
 *     }]
 *   }
 *
 */
const tree = (rows) => {
  let output = {
    BIN_id: rows[0] && rows[0].BIN_id,
    base_word: rows[0] && rows[0].base_word,
    correctness_grade_of_word: rows[0] && rows[0].correctness_grade_of_word,
    word_register: rows[0] && rows[0].word_register,
    word_categories: rows[0] && rows[0].word_categories,
    values: [],
  }

  // console.log(rows.slice(0,3))
  rows.forEach(row => {
    let currentArray = output.values
    row.inflectional_form_categories.forEach(tag => {
      const alreadyExists = currentArray.find(i => i.tag === tag)
      if (alreadyExists) {
        currentArray = alreadyExists.values
      } else if (!isNumber(tag)) {
        currentArray.push({
          tag,
          values: []
        })
        currentArray = currentArray[currentArray.length - 1].values
      } else {
        /* Tag is number, indicating variant */
        currentArray.push({
          inflectional_form_categories: row.inflectional_form_categories,
          word_categories: row.word_categories,
          variant_number: parseInt(tag),
          inflectional_form: row.inflectional_form,
          should_be_taught: row.should_be_taught,
          correctness_grade_of_inflectional_form: row.correctness_grade_of_inflectional_form,
          register_of_inflectional_form: row.register_of_inflectional_form,
          formattedOutput: row.formattedOutput,
          // various_feature_markers: row.various_feature_markers,
        })
      }
    })
  })

  output = TraverseAndSort(output)

  return output
}

/**
 * Sort tree based on the list `sorted_tags` array in ./classification/BIN_classification.js
 */
const TraverseAndSort = (input) => {
  if (Array.isArray(input)) {
    return input.sort(sort_by_classification).map(TraverseAndSort)
  } else if (input.values) {
    // console.log(input.values.slice(0,3))
    return {
      ...input,
      values: input.values.sort(sort_by_classification).map(TraverseAndSort)
    }
  } else {
    return input
  }
}

export const isNumber = (string) => {
  return typeof string === 'number' || /^\d+$/.test(string + '')
}

export default tree
