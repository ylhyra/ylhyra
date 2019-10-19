import React from 'react'
const router = (require('express')).Router()
import Parse from 'text-plugin/Parse'
import Traverse from 'text-plugin/Render/Traverse'
// import Render from 'text-plugin/Render'
import ReactDOMServer from 'react-dom/server'

router.post('/render', async (req, res) => {
  const html = req.body.html || req.query.html
  let output
  try {
    const { parsed, tokenized, data, flattenedData } = Parse({ html })
    output = ReactDOMServer.renderToStaticMarkup(
      <div className="ylhyra-text">
        {Traverse(parsed)}
        <div id="overlay"></div>
      </div>
    )
    output += `<script type="text/javascript">window.ylhyra_data=${JSON.stringify({ parsed, tokenized, data, flattenedData })}</script>`
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
