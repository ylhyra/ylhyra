import React from 'react'
const router = (require('express')).Router()
import Parse from 'text-plugin/Parse'
import Traverse from 'text-plugin/Render/Traverse'
// import Render from 'text-plugin/Render'
import ReactDOMServer from 'react-dom/server'

router.post('/render', async (req, res) => {
  const html = req.body.html || req.query.html
  const { parsed } = Parse({ html })
  const output = ReactDOMServer.renderToStaticMarkup(
    <div className="ylhyra-text">
      {Traverse(parsed)}
      <div id="overlay"></div>
    </div>
  )
  res.send(output)
})

export default router
