const express = require('express')
const router = express.Router()
import cors from 'cors'
import search from './search'
import get_by_id from './get_by_id'
import tree from 'server/inflection/tables/tree'
import render from 'server/inflection/tables'
import path from 'path'

/*
  Find possible base words and tags for a given word
*/
router.get('/inflection', cors(), (req, res) => {
  let { id, type } = req.query
  if (req.query.search) {
    return search(req.query.search, res)
  } else if (id) {
    get_by_id(id, res, (rows) => {
      /* Flat */
      if (type === 'flat') {
        return res.json(withLicense(rows, id))
      }
      /* HTML */
      else if (type === 'html') {
        return res.send(render(rows))
      }
      /* Nested */
      else {
        return res.send(withLicense(tree(rows), id))
      }
    })
  } else {
    // return res.status(400).send({ error: 'Parameters needed' })
    return res.sendFile(path.resolve(__dirname, `./../docs/README.md`))
  }
})
export default router

export const withLicense = (input, id) => {
  return {
    urls: {
      nested: `https://ylhyra.is/api/inflection?id=${id}`,
      flat: `https://ylhyra.is/api/inflection?id=${id}&type=flat`,
      html: `https://ylhyra.is/api/inflection?id=${id}&type=html`,
    },
    results: input,
    license: "CC BY-SA 4.0; https://ylhyra.is/Project:Inflections; © Árni Magnússon Institute for Icelandic Studies",
  }
}
