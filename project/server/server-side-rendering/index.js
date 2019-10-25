import React from 'react'
const router = (require('express')).Router()
import Parse from 'text-plugin/Parse'
import Render from 'text-plugin/Render'
// import Render from 'text-plugin/Render'
import ReactDOMServer from 'react-dom/server'
var now = require("performance-now")

router.post('/render', async (req, res) => {
  const html = req.body.html || req.query.html
  let output
  try {
    var t0 = now()
    const { parsed, tokenized, data, flattenedData } = Parse({ html })
    output = ReactDOMServer.renderToStaticMarkup(Render(parsed, { shouldReturnElement: true }))
    var t1 = now()
    output += `\n<script type="text/javascript">window.ylhyra_data=${JSON.stringify({ parsed, tokenized, data, flattenedData })}</script>`
    output += `\n<!-- Ylhýra parsed in ${(t1 - t0)} milliseconds -->`
  } catch (e) {
    console.error(e)
    output = html
  }
  res.send(output)
})

router.get('/render', async (req, res) => {
  res.send('ok')
})

export default router
