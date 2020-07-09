const express = require('express')
const router = express.Router()
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'

router.get('/inflection/:id', (req, res) => {
  const { id } = req.params
  // const { word } = req.body


  // const listOfWords = req.body.listOfWords
  // let where = []
  // let words = []
  // listOfWords.forEach(word => {
  //   where.push('lowercase = ?')
  //   words.push(word.word.toLowerCase())
  // })
  // if (words.length == 0) {
  //   res.sendStatus(400)
  //   return
  // }
  query(sql `
    SELECT * FROM inflection
    WHERE BIN_id = ${id}
    AND descriptive = 1
  `, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      // let tags = {}
      // results.forEach(row => {
      //   if (!tags[row.grammatical_tag]) {
      //     tags[row.grammatical_tag] = []
      //   }
      //   tags[row.grammatical_tag].push(row)
      // })
      // const output = `
      // <table>
      //   ${Object.keys(tags).map(tag => {
      //     return `<td>${tags[tag].map(i => i.inflectional_form).join('')}</td>`
      //   }).join('')}
      //
      // </table>`
      //
      // res.send(output)
      res.send(JSON.stringify(results, null, 2))


    }
  })
})
export default router;
