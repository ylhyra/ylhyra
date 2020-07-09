const express = require('express')
const router = express.Router()
const query = require('./../database/functions/query')
const getParameters = require('./../database/functions/getParameters')

router.post('/beyging', (req, res) => {
  const listOfWords = req.body.listOfWords
  let where = []
  let words = []
  listOfWords.forEach(word => {
    where.push('lowercase = ?')
    words.push(word.word.toLowerCase())
  })
  if (words.length == 0) {
    res.sendStatus(400)
    return
  }
  query(`SELECT id, word, classification, base, beyging.hash as hash, entry FROM beygjanleg_ord
    JOIN beyging ON beyging_hash = beyging.hash
    WHERE ${where.join(' OR ')}
    ORDER BY word, beyging_hash, classification
    `, words, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.send(JSON.stringify(results, null, 2))
    }
  })
})
module.exports = router
