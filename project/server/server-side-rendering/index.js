import React from 'react'
const router = (require('express')).Router()
import Parse from 'frontend/Parse'
import Render from 'frontend/Render'
// import Render from 'frontend/Render'
import ReactDOMServer from 'react-dom/server'
var now = require("performance-now")


/*
To test:
http://localhost:9123/api/render?html=texti
*/
router.all('/render', async(req, res) => {
  const html = req.body.html || req.query.html
  let output = ''
  if (html) {
    try {
      var t0 = now()
      const { parsed, tokenized, data, flattenedData } = await Parse({ html })
      if (!parsed) return res.sendStatus(500);
      output = ReactDOMServer.renderToStaticMarkup(Render(parsed, { shouldReturnElement: true }))
      var t1 = now()
      output += `<script type="text/javascript">window.ylhyra_data=${JSON.stringify({ parsedHTML: ReactDOMServer.renderToStaticMarkup(parsed), tokenized, data, flattenedData })}</script>`
      output += `<!-- Ylhýra parsed in ${(t1 - t0)} milliseconds -->`
    } catch (e) {
      console.error(e)
      output = html
    }
  }
  res.send(output)
})

export default router
