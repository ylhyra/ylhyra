import express from 'express'
const router = express.Router()
import query from 'common/database/tagger'
import DownloadFromGithub from 'server/api/projects/DownloadFromGithub'

// // Read all
// router.get('/documents', (req, res) => {
//   query(`
//     SELECT documents.*, metadata, type, updated_at, word_count, revision_id
//     FROM documents
//     LEFT JOIN revisions
//     ON revisions.document_id = document_id
//     WHERE revisions.revision_id = (
//       SELECT MAX(revision_id)
//       FROM revisions
//       WHERE revisions.document_id = documents.id
//     )
//     AND documents.owner = ?
//     ORDER BY
//       updated_at DESC,
//       type ASC,
//       id ASC
//       `, [getUser(req)], (err, results) => {
//     if (err) {
//       console.error(err)
//       res.send(err)
//     } else {
//       // console.log(results)
//       res.send(results)
//     }
//   })
// })


export default router;
