/*
  Turns rows into nested object
*/
require('array-sugar')
export default (rows) => {
  let output = {
    BIN_id: rows[0].BIN_id,
    base_word: rows[0].base_word,
    correctness_grade_of_base_word: rows[0].correctness_grade_of_base_word,
    register_of_base_word: rows[0].register_of_base_word,
    word_class: rows[0].word_class,
    table_values: [],
  }

  rows.forEach(row => {
    let currentArray = output.table_values
    row.form_classification.forEach(tag => {
      let c = currentArray.find(i => i.tag === tag)
      if (c) {
        currentArray = c.values
      } else {
        currentArray.push({
          tag,
          values: []
        })
        currentArray = currentArray.last.values
      }
    })
    currentArray.push({
      inflectional_form: row.inflectional_form,
      descriptive: row.descriptive,
      correctness_grade_of_word_form: row.correctness_grade_of_word_form,
      register_of_word_form: row.register_of_word_form,
      only_found_in_idioms: row.only_found_in_idioms,
    })
  })

  return output
}
