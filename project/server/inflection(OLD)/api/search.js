import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
import classify from 'inflection/tables/classify'
import { withLicense } from './index'
const IcelandicCharacters = /^[a-záéíóúýðþæö]+$/i

/*
  Find possible base words and tags for a given word
*/
export default (word, res) => {
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
            urls: {
              nested: `https://ylhyra.is/api/inflection?id=${row.BIN_id}`,
              flat: `https://ylhyra.is/api/inflection?id=${row.BIN_id}&type=flat`,
              html: `https://ylhyra.is/api/inflection?id=${row.BIN_id}&type=html`,
            },
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
}
