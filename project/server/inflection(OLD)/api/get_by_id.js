import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
import classify, { sort_by_classification } from 'inflection/tables/classify'

/*
  Full table for id
*/
export default (id, res, callback) => {
  query(sql `
    SELECT
      BIN_id,
      base_word,
      inflectional_form,
      word_class,
      correctness_grade_of_base_word,
      register_of_base_word,
      grammar_group,
      cross_reference,
      descriptive,
      grammatical_tag,
      correctness_grade_of_word_form,
      register_of_word_form,
      only_found_in_idioms,
      alternative_entry
    FROM inflection
    WHERE BIN_id = ${id}
    -- AND descriptive = 1
  `, (err, results) => {
    if (err) {
      res.send(err)
    } else if (results.length < 1) {
      return res.status(404).send({ error: 'No results' })
    } else {
      let output = results.map(i => classify(i)).sort(sort_by_classification)
      callback(output)
    }
  })
}
