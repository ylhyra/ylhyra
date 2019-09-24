import express from 'express'
const router = express.Router()
import query from 'common/database/tagger'
import getParameters from 'common/database/functions/getParameters'
import fs from 'fs'
import multer from 'multer'
var upload = multer({ dest: 'uploads/' })
import shortid from 'shortid'
import path from 'path'
import { exec } from 'child_process'
import urlSlug from 'url-slug'

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

router.post('/recorder/save', upload.single('file'), (req, res) => {
  // console.log(req.file); // TEMP We are not using multipart/form-data at the moment

  var base64_data = req.body.data.match(/^data:.+\/(.+);base64,(.*)$/)[2]
  var buffer = new Buffer(base64_data, 'base64')

  const name    = urlSlug(req.body.word).slice(0, 30) + '_' + shortid.generate().slice(0,4)
  const wavPath = path.resolve(__dirname, `../../uploads/${name}.wav`)
  const m4a     = `/media/${name}.m4a`
  const m4aPath = path.resolve(__dirname, `../../uploads/${name}.m4a`)
  fs.writeFile(wavPath, buffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500)
    }
    // console.log("The file was saved!")
    // console.log(`
    //   ffmpeg -i ${wavPath}
    //     # -vn -af
    //     # acompressor=threshold=-21dB:ratio=9:attack=200:release=1000
    //     # silenceremove=1:0:0:1:1:-50dB:1
    //     ${m4a}
    //   # &&
    //   # rm ${m4aPath}
    // `)
    exec(`
      ffmpeg -i ${wavPath} ${m4aPath}
    `, (err) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500)
      }

      query(
        `INSERT INTO sounds SET text = ?, file = ?, speaker = ?`, [req.body.word, m4a, 'Egill'], (err2, results) => {
          if (err2) {
            console.error(err2)
            res.sendStatus(500)
          } else {
            res.send(m4a)
          }
        })

    })

    // res.send(true)
  })
})

export default router;

/*
  TODO
  https://ffmpeg.org/ffmpeg-filters.html#silenceremove
  nota "silenceremove=1:1:-50dB:1:1:-50dB:1" á ffmpeg
*/
