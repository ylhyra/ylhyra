const express = require('express')
const router = express.Router()
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
var cors = require('cors')

/*
  Find possible base words and tags for a given word
*/
router.post('/inflection/search', (req, res) => {
  const { word } = req.body
  if (!word) {
    return res.sendStatus(400)
  }
  query(sql `
    SELECT * FROM inflection
    WHERE inflectional_form_lowercase = ${word.toLowerCase()}
    ORDER BY descriptive DESC
  `, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.send(results)
    }
  })
})

/*
  Full table for id
*/
router.get('/inflection/:id', cors({ origin: '*' }), (req, res) => {
  const { id } = req.params
  query(sql `
    SELECT * FROM inflection
    WHERE BIN_id = ${id}
    AND descriptive = 1
  `, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.send(JSON.stringify(results, null, 2))
    }
  })
})
export default router;
