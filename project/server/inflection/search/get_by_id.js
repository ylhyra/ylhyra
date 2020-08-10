const express = require('express')
const router = express.Router()
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
import cors from 'cors'
import classify from './classify'
import { sort_by_classification } from 'frontend/Render/Elements/Inflection/tree'

/*
  Full table for id
*/
router.get(['/inflection/id/:id', '/inflection/:id'], cors(), (req, res) => {
  const { id } = req.params
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
      res.json(withLicense(output))
    }
  })
})
export default router;


const withLicense = (input) => {
  return {
    results: input,
    license: "CC BY-SA 4.0; https://ylhyra.is/Project:Inflections; © Árni Magnússon Institute for Icelandic Studies",
  }
}
