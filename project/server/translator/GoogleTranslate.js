const { TranslationServiceClient } = require('@google-cloud/translate').v3beta1;
const { GOOGLE_API_PROJECT_ID } = process.env
import { AllHtmlEntities as Entities } from 'html-entities'
const entities = new Entities()
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'

export default async (translation_hashes) => {
  let done = await GetFromDatabase(translation_hashes)
  let missing_html = ''
  Object.keys(translation_hashes).forEach(hash => {
    if (done[hash]) {
      translation_hashes[hash].translation = done[hash].translation
    } else if (translation_hashes[hash].text) {
      missing_html += `<div id=${hash}>${translation_hashes[hash].text}</div>\n`
    }
  })
  // console.log({done,missing_html})
  // if (missing_html) {
  //   console.log('Sending to Google Translate')
  //   const results = await GetGoogleTranslate(missing_html)
  //   done = { ...done, ...results }
  // }
  // console.log(GOOGLE_API_PROJECT_ID)
  return Promise.resolve(done)
}


const GetFromDatabase = (translation_hashes) => {
  return new Promise((resolve, reject) => {
    let i = ''
    Object.keys(translation_hashes).forEach(hash => {
      i += sql `SELECT hash, translation FROM google_translate WHERE hash = ${hash};`
    })
    if (!i) return resolve({});
    // console.log(i)
    query(i, (err, results) => {
      if (err) {
        reject()
      } else {
        let output = {}
        // console.log(JSON.stringify(results))
        results.forEach(i => {
          if (!i[0]) return;
          output[i[0].hash] = i[0].translation
        })
        resolve(output)
      }
    })
  })
}

const GetGoogleTranslate = async (html) => {
  // return new Promise(async(resolve, reject) => {
  if (!GOOGLE_API_PROJECT_ID) return console.error('No Google API project ID')
  const translationClient = new TranslationServiceClient()
  const request = {
    parent: translationClient.locationPath(GOOGLE_API_PROJECT_ID, 'global'),
    contents: [html],
    mimeType: 'text/html', // mime types: text/plain, text/html
    sourceLanguageCode: 'is-IS',
    targetLanguageCode: 'en-US',
  }
  const [response] = await translationClient.translateText(request)
  // for (const translation of response.translations) {
  //   // console.log(`Translation: ${translation.translatedText}`)
  // }
  // console.log(response)
  const translatedText = response?.translations[0]?.translatedText

  let results = {}
  translatedText && translatedText.split(/(<(?:span|div).*?<\/(?:span|div)>)/g).forEach(x => {
    var y = x.match(/<(?:span|div) id="?(.*?)"?>(.*?)<\/(?:span|div)>/);
    if (!y) return null;
    const id = y[1]
    const text = y[2]
    results[id] = entities.decode(text).trim()
  })

  // console.log(results)
  console.log(`Google Translate requested for ${Object.keys(results).length} words`)

  SaveResults(results)

  return results
}

const SaveResults = (results) => {
  Object.keys(results).forEach(hash => {
    query(sql `INSERT IGNORE INTO google_translate SET
        hash = ${hash},
        translation = ${results[hash]}
        ;
        `, (err, results) => {
      if (err) {
        console.error(err)
      } else {}
    })
  })
}
