const router = (require('express')).Router()
import { exec } from 'child_process'
import { upload_path } from 'config.js'
import fs from 'fs'
import path from 'path'
import shortid from 'shortid'
const tmp_name = `tmp_${shortid.generate()}`

/*
  TODO: This should be put as a queued process
*/
router.post('/audio/synchronize', (req, res) => {
  const { lang, audio_file, xml } = req.body
  if (!lang || !audio_file || !xml) {
    res.status(400)
    // console.log({lang,audio_file,xml})
    res.send(`Missing parameters`)
  } else {
    // TEMP
    synchronize({ lang, audio_file, xml }, res)
    // res.sendStatus(200)
  }
})

/**
  Here we use [Aeneas](https://github.com/readbeyond/aeneas)
  to automatically synchronize audio and text.
*/
const synchronize = async ({ lang, audio_file, xml }, res) => {
  const LANGUAGE = lang // Three letter ISO 639-3 language code
  const AUDIO_FILE = path.resolve(upload_path, audio_file.replace(/\//g,''))
  const INPUT_XML = path.resolve(upload_path, `${tmp_name}.xhtml`)
  const OUTPUT_JSON = path.resolve(upload_path, `${tmp_name}.json`)

  // console.log(xml)
  // console.log(INPUT_XML)
  await new Promise((resolve, reject) => {
    fs.writeFile(INPUT_XML, `<xml id="root">${xml}</xml>`, (err) => {
      if (err) throw err;
      resolve()
    })
  })

  try {
    await new Promise((resolve, reject) => {
      exec(
        ` python -m aeneas.tools.execute_task ` +
        `  ${AUDIO_FILE} ` +
        `  ${INPUT_XML} ` +
        `  "task_language=${LANGUAGE}|` +
        `os_task_file_format=json|` +
        `is_text_type=munparsed|` +
        `is_text_munparsed_l1_id_regex=root|` +
        `is_text_munparsed_l2_id_regex=s[A-Za-z0-9_\\-]+|` +
        `is_text_munparsed_l3_id_regex=w[A-Za-z0-9_\\-]+" ` +
        ` ${OUTPUT_JSON} ` +
        ` --presets-word
    `, (err, stdout, stderr) => {
          if (err) {
            console.error(err)
            reject(err)
          } else if (stderr) {
            console.error(stderr)
            reject(stderr)
          } else {
            resolve()
          }
        })
    })
  } catch (e) {
    res.status(400)
    res.send(e)
  }

  const json = await new Promise((resolve, reject) => {
    fs.readFile(OUTPUT_JSON, 'utf8', (err, data) => {
      if (err) throw err;
      // console.log(data)
      resolve(data)
    })
  })

  res.send(json)

  fs.unlink(OUTPUT_JSON, (err) => {})
  fs.unlink(INPUT_XML, (err) => {})
}


export default router;
