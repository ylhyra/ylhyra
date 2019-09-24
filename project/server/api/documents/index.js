import express from 'express'
const router = express.Router()
import query from 'common/database/tagger'
import getParameters from 'common/database/functions/getParameters'
// const LZUTF8 = require('lzutf8')
// console.log(LZUTF8.compress(``, { outputEncoding: 'Base64' }))
import SaveTranslator from 'server/api/translate/translator/SaveTranslations'

// Read all
router.get('/documents', (req, res) => {
  query(`
    SELECT documents.*, metadata, type, updated_at, word_count, revision_id
    FROM documents
    LEFT JOIN revisions
    ON revisions.document_id = document_id
    WHERE revisions.revision_id = (
      SELECT MAX(revision_id)
      FROM revisions
      WHERE revisions.document_id = documents.id
    )
    AND documents.owner = ?
    ORDER BY
      updated_at DESC,
      type ASC,
      id ASC
      `, [getUser(req)], (err, results) => {
    if (err) {
      console.error(err)
      res.send(err)
    } else {
      // console.log(results)
      res.send(results)
    }
  })
})


// Read
router.get('/documents/:id', (req, res) => {
  query(`
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
    -- AND d.owner = ?
  `, [req.params.id, req.params.id, getUser(req)], (err, results) => {
    if (err) {
      console.error(err)
      res.send(err)
    } else {
      res.send(results[0])
    }
  })
})

// Create
router.post('/documents/getId', (req, res) => {
  query(`INSERT INTO documents SET owner = ?`, [getUser(req)], (err, results) => {
    if (err) {
      console.error(err)
      res.send(err)
    } else {
      res.send({
        id: results.insertId
      })
    }
  })
})

// Update
router.put('/documents/:id', (req, res) => {
  CanUserWriteToThisDocument(req, res, () => {
    const data = req.body.data

    const update = getParameters({
      document_id: req.params.id,
      from_lang: data.metadata.from,
      to_lang: data.metadata.to,
      type: data.metadata.type,
      title: data.metadata.title,
      word_count: data.list && data.list.arrayOfAllWordIDs.length,
      metadata: JSON.stringify(data.metadata),
      input: data.input.trim() + '\n',
      parsed: JSON.stringify(data.parsed),
      list: JSON.stringify(data.list),
      translation: JSON.stringify(data.translation),
      tokenized: JSON.stringify(data.tokenized),
      suggestions: JSON.stringify(data.suggestions),
      audio: JSON.stringify(data.audio),
      pronunciation: JSON.stringify(data.pronunciation),
      updated_by: req.session.user_id || req.session.id || null,
      compiled: data.compiled,
    })

    if (!update.values.length > 0) {
      res.sendStatus(400)
      return
    }

    /*
      TEMP!!
      RESAVES TRANSLATIONS ON EVERY SINGLE SAVE!!
    */
    SaveTranslator({
      document_id: req.params.id,
      from: data.metadata.from,
      to: data.metadata.to,
      translation: data.translation,
      list: data.list,
    })

    query(`
      INSERT INTO revisions SET ${update.parameters}
      `, [...update.values], (err) => {
      if (err) {
        console.error(err)
        res.sendStatus(400)
      } else {
        res.sendStatus(200)
      }
    })
  })
})

export default router;


const CanUserWriteToThisDocument = (req, res, callback) => {
  if(process.env.NODE_ENV!=='production') return callback();
  query(`
      SELECT * FROM documents d
      WHERE d.id = ?
      AND d.owner = ?
    `, [req.params.id, getUser(req)], (err, results) => {
    if (err) {
      console.error(err)
      res.sendStatus(400)
    } else if (results.length === 0) {
      res.sendStatus(401) // 401 Unauthorized
    } else {
      callback()
    }
  })
}


const getUser = (req) => {
  return req.session.user_id || req.session.id
}
