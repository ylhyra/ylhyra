/*
  Note: This file currently relies on being a submodule of Ylhýra.
*/
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
import classify from 'server/inflection/tables/classification/BIN_classification'
import { sort_by_classification } from 'server/inflection/tables/classification/sort_by_classification'

/*
  Full table for id
*/
export default (id, callback) => {
  query(sql `
    SELECT
      inflection.BIN_id,
      base_word,
      inflectional_form,
      word_categories,
      BIN_domain,
      correctness_grade_of_word,
      word_register,
      grammar_group,
      cross_reference,
      should_be_taught,
      grammatical_tag,
      correctness_grade_of_inflectional_form,
      register_of_inflectional_form,
      various_feature_markers,
      alternative_entry
    FROM inflection
    WHERE inflection.BIN_id = ${id};
    -- AND correctness_grade_of_inflectional_form = 1
    -- AND should_be_taught = 1

    SELECT *
    FROM vocabulary_input
    -- LEFT JOIN vocabulary_input
    --   ON inflection.BIN_id = vocabulary_input.BIN_ID
    LEFT JOIN vocabulary_fields
      ON vocabulary_fields.id = vocabulary_input.vocabulary_id
    WHERE vocabulary_input.BIN_id = ${id};

  `, (err, results) => {
    if (err) {
      callback(null)
    } else {
      try {
        const rows = results[0].map(i => classify(i)).sort(sort_by_classification)

        // console.log(results[1][1])
        // console.log(output)
        callback(rows)
      } catch (e) {
        console.error(e)
        callback('Error')
      }
    }
  })
}
