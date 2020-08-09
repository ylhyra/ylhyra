const express = require('express')
const router = express.Router()
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
import cors from 'cors'
import classify from './classify'
const IcelandicCharacters = /^[a-záéíóúýðþæö]+$/i

/*
  Find possible base words and tags for a given word
*/
router.get('/inflection/search/:word', cors(), (req, res) => {
  let { word } = req.params
  if (!word ||
    word.length > 100 ||
    !IcelandicCharacters.test(word) // No spaces
  ) {
    return res.status(400).send({ error: 'Invalid string' })
  }
  word = word.trim().toLowerCase().replace(/\s+/g, ' ')
  query(sql `
    SELECT BIN_id, base_word, inflectional_form, word_class, grammatical_tag, descriptive FROM inflection
    WHERE inflectional_form_lowercase = ${word}
    ORDER BY
    descriptive DESC,
    correctness_grade_of_word_form DESC
    LIMIT 100
  `, (err, results) => {
    if (err) {
      res.send(err)
    } else if (results.length < 1) {
      return res.status(404).send({ error: 'No results' })
    } else {
      let grouped = []
      results.forEach(row => {
        let index = grouped.findIndex(i => i.BIN_id === row.BIN_id)
        if (index < 0) {
          grouped.push({
            BIN_id: row.BIN_id,
            api_url: `https://ylhyra.is/api/inflection/id/${row.BIN_id}`,
            base_word: row.base_word,
            word_class: classify(row, 'word_class'),
            matches: [],
          })
          index = grouped.length - 1
        }
        grouped[index].matches.push({
          inflectional_form: row.inflectional_form,
          form_classification: classify(row, 'form_classification'),
          descriptive: row.descriptive,
        })
      })
      res.json(withLicense(grouped))
    }
  })
})

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
      let output = results.map(i => classify(i))
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
