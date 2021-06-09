// import links from './../../output/links'
import compiler from 'compiler/generate_html'
import generate_html, { URL_title } from 'compiler/generate_html'
const router = (require('express')).Router()
var fs = require('fs')
const folder = __dirname + '/../../output/'
let links = require('src/output/links.js')

router.get('/content', async(req, res) => {
  const title = URL_title(req.query.title)
  if (links[title]) {
    const content = await generate_html(title)
    res.send({
      content,
    })
  } else {
    return res.sendStatus(404)
  }
})

export default router;



export const ParseHeaderAndBody = (data) => {
  let [header, body] = data.split(/\n>>>>\n/)

  let output = {}
  header.split('\n').forEach(i => {
    const [key, val] = i.split(/ = /)
    if (key) {
      output[key] = val
    }
  })
  return { header, body }
}
