/*
  Turns rows into nested tree
*/
require('array-sugar')
export default (rows) => {
  let output = []

  rows.forEach(row => {
    let currentArray = output
    row.form_classification.forEach(tag => {
      const alreadyExists = currentArray.find(i => i.tag === tag)
      if (alreadyExists) {
        currentArray = alreadyExists.values
      } else if (!isNumber(tag)) {
        currentArray.push({
          tag,
          values: []
        })
        currentArray = currentArray.last.values
      } else {
        /* Tag is number, indicating variant */
        currentArray.push({
          form_classification: row.form_classification,
          word_class: row.word_class,
          variant_number: parseInt(tag),
          inflectional_form: row.inflectional_form,
          descriptive: row.descriptive,
          correctness_grade_of_word_form: row.correctness_grade_of_word_form,
          register_of_word_form: row.register_of_word_form,
          only_found_in_idioms: row.only_found_in_idioms,
        })
        /* Sort in case variants are out of order (should also be done for other items) */
        currentArray = currentArray.sort((a, b) => (a.variant_number - b.variant_number))
      }
    })
  })

  return output
}

const isNumber = (string) => {
  return /^\d+$/.test(string + '')
}

// let output = {
//   BIN_id: rows[0].BIN_id,
//   base_word: rows[0].base_word,
//   correctness_grade_of_base_word: rows[0].correctness_grade_of_base_word,
//   register_of_base_word: rows[0].register_of_base_word,
//   word_class: rows[0].word_class,
//   table_values: [],
// }
