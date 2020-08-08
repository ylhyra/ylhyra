const express = require('express')
const router = express.Router()
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
import cors from 'cors'

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
      res.setHeader("Content-Type", "application/json");
      let grouped = []
      results.forEach(row => {
        let index = grouped.findIndex(i => i.BIN_id === row.BIN_id)
        if (index < 0) {
          grouped.push({
            BIN_id: row.BIN_id,
            api_url: `https://ylhyra.is/api/inflection/id/${row.BIN_id}`,
            base_word: row.base_word,
            word_class: row.word_class,
            matches: [],
          })
          index = grouped.length - 1
        }
        grouped[index].matches.push({
          inflectional_form: row.inflectional_form,
          word_class: row.word_class,
          grammatical_tag: row.grammatical_tag,
          descriptive: row.descriptive,
        })
      })

      res.send(withLicense(grouped))
    }
  })
})

/*
  Full table for id
*/
router.get(['/inflection/id/:id', '/inflection/:id'], cors(), (req, res) => {
  const { id } = req.params
  query(sql `
    SELECT * FROM inflection
    WHERE BIN_id = ${id}
    -- AND descriptive = 1
  `, (err, results) => {
    if (err) {
      res.send(err)
    } else if (results.length < 1) {
      return res.status(404).send({ error: 'No results' })
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send(withLicense(results))
    }
  })
})
export default router;


const withLicense = (input) => {
  return JSON.stringify({
    results: input,
    license: "CC BY-SA 4.0; https://ylhyra.is/Project:Inflections; © Árni Magnússon Institute for Icelandic Studies",
  }, null, 2)
}
