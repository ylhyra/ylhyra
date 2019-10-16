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
    const { parsed } = Parse({ html })
    output = ReactDOMServer.renderToStaticMarkup(Render(parsed, true))
    var t1 = now()
    output += `<!-- Ylhýra parsed in ${(t1 - t0)} milliseconds -->`
  } catch(e){
    console.error(e)
    output = html
  }
  res.send(output)
})

router.get('/render', async (req, res) => {
  res.send('ok')
})

export default router
