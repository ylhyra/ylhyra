import express from 'express'
const router = express.Router()
import query from 'common/database/tagger'
import path from 'path'
import zip from 'express-zip'
// import TextCompiler, { WrapInHTML } from 'Editor/5-Compiler/'
import YAML from 'yamljs'
import { minify } from 'html-minifier'
import UploadFileToGit from 'tagger/server/api/projects/UploadFileToGit'
import WrapInHTML from 'Editor/5-Compiler/WrapInHTML'

router.get([
  '/documents/:id/(:publication/)?:filename.:extension',
  '/documents/:id/(:publication/)?:filename',
  '/html/:id/',
], (req, res) => {
  const extension = req.params.extension || 'html'
  query(
    `
    SELECT *
    FROM documents d
    LEFT JOIN
    (
      SELECT * FROM revisions
    	WHERE revision_id = (
        SELECT MAX(revision_id)
        FROM revisions r1
        WHERE r1.document_id = ?
      )
    ) r2
    ON r2.document_id = id
    WHERE d.id = ?

    `, [req.params.id, req.params.id], async (err, results) => {
      if (err || results.length === 0 || !results[0].parsed) {
        err && console.error(err)
        !results[0].parsed && console.log('Document not parsed')
        res.status(400)
        res.send(`Document doesn't exist.`)
      } else {
        const result = results[0]
        const metadata = JSON.parse(result.metadata)

        if(!result.parsed) {
          res.send('You have not finished your document.')
          return
        }

        let compiled = result.compiled
        if (!compiled) {
          res.status(400)
          console.log('Document not compiled')
          return res.send('Document not compiled')
          /*

            TODO

            DOES NOT CURRENTLY WORK SINCE COMPILATION NOW USES WrapInTags()

          */

          // await new Promise(resolve => {
          //   TextCompiler({
          //     id: result.id,
          //     parsed: result.parsed && JSON.parse(result.parsed),
          //     translation: result.translation && JSON.parse(result.translation),
          //     audio: result.audio && JSON.parse(result.audio),
          //     pronunciation: result.pronunciation && JSON.parse(result.pronunciation),
          //     list: result.list && JSON.parse(result.list),
          //     metadata: metadata,
          //   }, output => {
          //     compiled = minify(output, {
          //       collapseBooleanAttributes: true,
          //       // removeComments: true,
          //       collapseWhitespace: true,
          //       removeAttributeQuotes: true,
          //       removeRedundantAttributes: true,
          //       removeEmptyAttributes: true,
          //       removeOptionalTags: true,
          //       minifyJS: true,
          //       sortAttributes: true,
          //       sortClassName: true,
          //     })
          //     resolve()
          //   })
          // })
        }

        const compiled_with_YAML_header = '---\n' + YAML.stringify({ ...metadata, compiled: true, markdown: false }) + '---\n\n' + compiled

        /*
          Send HTML file
        */
        if (extension === 'html') {
          if (req.query.type === 'snippet_with_metadata') {
            res.setHeader('Content-type', 'text/plain')
            res.send(compiled_with_YAML_header)
          } else if (req.query.type === 'snippet') {
            res.setHeader('Content-type', 'text/plain')
            res.send(compiled)
          } else if (req.query.type === 'git') {
            UploadFileToGit({
              metadata,
              compiled: compiled_with_YAML_header,
            }, () => {
              /*
                TODO:
                Find way to send results back...
                Will need to do this through websockets.
              */
            })
            res.sendStatus(200)
          }
          else {
            res.send(WithVersion(WrapInHTML(compiled, metadata)))
            // res.status(404)
            // res.send('Temporarily not supported')
          }
        }

        // /*
        //   Send Javascript file.
        //   Can then be embedded as:
        //   <script src="/api/documents/22/file.js"></script>
        // */
        // else if (extension === 'js') {
        //   res.set('Content-Type', 'text/javascript; charset=utf-8');
        //   res.set('Cache-Control', 'public, immutable, max-age=31557600');
        //   res.send(`
        //   document.write(
        //     '<script type="text/javascript" src="${""}"></scr'+'ipt>' +
        //     ${JSON.stringify(WithVersion(WrapInHTML(compiled)))}
        //   )
        // `.trim().replace(/(\s+)/g, ' '))
        // }
        else {
          res.status(404)
          res.send('Not supported')
        }

        /*
          Save compiled data (when in production)
        */
        if (process.env.NODE_ENV === 'production') {
          if (!result.compiled) {
            query(`
              UPDATE revisions SET compiled = ? WHERE revision_id = ?
              `, [compiled, result.revision_id], (err) => {
              if (err) { console.error(err) }
            })
          }
        }
      }
    })
})

const WithVersion = (input) => input.replace(/\/punktur\.js/g, '/punktur.js?v=' + (process.env.npm_package_version || ''))

export default router;
