import express from 'express'
const router = express.Router()
import query from 'common/database/tagger'
import path from 'path'
import zip from 'express-zip'

router.get('/documents/:id/zip', (req, res) => {
  // query(`SELECT * FROM documents WHERE id = ?`, [req.params.id], (err, results) => {
  //   if (err) {
  //     res.send(err)
  //   } else {
  //     res.send(results[0])
  //   }
  // })

  // console.log(path.resolve(__dirname, `../../../../uploads/demo.html`))
  res.zip([{
      path: path.resolve(__dirname, `../../../../uploads/demo.html`),
      name: '/rosa_flott.html'
    },{
        path: path.resolve(__dirname, `../../../../uploads/demo.html`),
        name: '/rosa_flott2.html'
      }
    //  {
    //   path: path.resolve(__dirname, `../uploads/${name}.m4a`),
    //   name: 'file2.name'
    // }
  ], 'RosaFint.zip', (err) => {
    if (err) {
      console.error(err)
      return
    }

  });
})

export default router;

// document.write('<link rel="stylesheet" href="https://assets-cdn.github.com/assets/gist-embed-87673c31a5b37b5e6556b63e1081ebbc.css">')
// document.write('<div id=\"gist31678285\" class=\"gist\">\n')
