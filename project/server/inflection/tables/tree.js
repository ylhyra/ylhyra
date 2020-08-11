/*
  Turns rows into nested tree
*/
require('array-sugar')
import { sort_by_classification } from 'server/inflection/tables/classify'
export default (rows) => {
  // let output = []
  let output = {
    BIN_id: rows[0].BIN_id,
    base_word: rows[0].base_word,
    correctness_grade_of_base_word: rows[0].correctness_grade_of_base_word,
    register_of_base_word: rows[0].register_of_base_word,
    word_class: rows[0].word_class,
    values: [],
  }

  rows.forEach(row => {
    let currentArray = output.values
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
      }
    })
  })

  output = TraverseAndSort(output)

  // console.log(output)
  return output
}

const isNumber = (string) => {
  return /^\d+$/.test(string + '')
}


const TraverseAndSort = (input) => {
  if (Array.isArray(input)) {
    return input.sort(sort_by_classification).map(TraverseAndSort)
  } else if (input.values) {
    return {
      ...input,
      values: input.values.sort(sort_by_classification).map(TraverseAndSort)
    }
  } else {
    return input
  }
}
