import express from 'express'
const router = express.Router()
import query from 'server/database'
import getParameters from 'server/database/functions/getParameters'
import fs from 'fs'
import multer from 'multer'
var upload = multer({ dest: 'uploads/' })
import shortid from 'shortid'
import path from 'path'
import { exec } from 'child_process'
import urlSlug from 'App/functions/url-slug'

/*
  TODO! Access control
*/
router.post('/recorder/save', (req, res) => {
  const { base64_data, word, speaker, should_save } = req.body
  var buffer = Buffer.from(base64_data, 'base64')

  // Audio name that will be returned to user
  const unsafeName = (word.slice(0, 15).trim() + ' ' + shortid.generate().slice(0, 4)).trim()
  const safeName = `pron_${urlSlug(unsafeName)}`.trim()
  const wikiFilename = `${unsafeName}.mp3` // Af hverju var ég að nota MP3 áður?
  const wavPath = path.resolve(__dirname, `../../../uploads/${safeName}.wav`)
  const mp3Filename = `${safeName}.mp3` // Af hverju var ég að nota MP3 áður?
  const mp3Path = path.resolve(__dirname, `../../../uploads/${safeName}.mp3`)
  fs.writeFile(wavPath, buffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500)
    }
    // console.log("The file was saved!")
    // // console.log(`
    // //   ffmpeg -i ${wavPath}
    // //     # -vn -af
    // //     # acompressor=threshold=-21dB:ratio=9:attack=200:release=1000
    // //     # silenceremove=1:0:0:1:1:-50dB:1
    // //     ${mp3}
    // //   # &&
    // //   # rm ${mp3Path}
    // // `)
    exec(`
      ffmpeg -i ${wavPath} ${mp3Path}
    `, (err) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500)
      }

      /* TEMPORARY FOR DEVELOPMENT; DON'T SAVE */
      if (word && should_save) {
        query(
          `INSERT INTO sounds SET text = ?, file = ?, speaker = ?`, [word, wikiFilename, speaker], (err2, results) => {
            if (err2) {
              res.sendStatus(500)
            } else {
              res.send({ wikiFilename, mp3Filename })
            }
          })
      } else {
        return res.send({ wikiFilename, mp3Filename })
      }
    })
  })
})
export default router;

/*
  TODO
  https://ffmpeg.org/ffmpeg-filters.html#silenceremove
  nota "silenceremove=1:1:-50dB:1:1:-50dB:1" á ffmpeg
*/









// // Read all
// router.get('/recorder', (req, res) => {
//
//   // res.send([
//   //   'að geta',
//   //   'þú getur',
//   //   'hann getur',
//   //   'ég get',
//   //   'þið getið',
//   //   'þeir geta',
//   //   'ég gat',
//   //   'þú gast',
//   //   'hann gat',
//   //   'við gátum',
//   //   'þeir gátu',
//   //   'við getum',
//   //   'ég hélt að ég gæti',
//   //   'ég hélt að þú gætir',
//   //   'ég hélt að hann gæti',
//   //   'ég hélt að við gætum',
//   //   'ég hélt að þið gætuð',
//   //   'ég hélt að þeir gætu',
//   //   'ég held að ég geti',
//   //   'ég held að þú getir',
//   //   'ég held að við getum',
//   //   'ég held að hann geti',
//   //   'ég held að þið getið',
//   //   'ég held að þeir geti',
//   //   'geturðu',
//   //   'gastu',
//   //   'þið gátuð',
//   // ])
//
//   query(`
//     SELECT missing_sounds.text FROM missing_sounds
//     LEFT JOIN sounds ON sounds.text = missing_sounds.text
//     WHERE file IS NULL
//     ORDER BY importance, RAND()
//   `
//   , (err, results) => {
//
//     if (err) {
//       console.error(err)
//       res.send(err)
//     } else {
//       res.send(results.map(i => i.text))
//     }
//   })
// })
