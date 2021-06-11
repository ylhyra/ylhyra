import generate_html from 'documents/Compile'
import { URL_title } from 'documents/Compile/functions'
const router = (require('express')).Router()
var fs = require('fs')
const folder = __dirname + '/../../output/'
let links = require('src/output/links.js')
const yaml = require('js-yaml');

router.get('/content', async(req, res) => {
  let url = URL_title(req.query.title)
  let values = links[url]
  if (values) {
    let output = {}
    let title = values.title
    if (values.redirect_to) {
      url = values.redirect_to
      title = links[values.redirect_to].title
      output.redirect_to = values.redirect_to
      output.section = values.section
    } else if (req.query.title !== url) {
      output.redirect_to = url
    }
    // console.log(info)
    const content = await generate_html(url)
    res.send({
      ...output,
      content,
      title,
    })
  } else {
    return res.sendStatus(404)
  }
})

export default router;



export const ParseHeaderAndBody = (data) => {
  const match = data.trim().match(/^---\n([\s\S]+?)\n---([\s\S]+)?/)
  if (!match) {
    throw new Error('Failed to parse\n\n' + data)
    return;
  }
  let [j, header, body] = match

  let output = {}
  // header = header.replace(/: (.+):/g, ': $1\\:')
  header = yaml.load(header)
  body = (body || '').trim()

  if (!header.title && header.title !== '') {
    throw new Error('Missing title\n\n' + data)
    return;
  }

  return { header, body }
}