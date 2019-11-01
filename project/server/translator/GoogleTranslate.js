const { TranslationServiceClient } = require('@google-cloud/translate').v3beta1;
const { GOOGLE_API_PROJECT_ID } = process.env
import { html2json, json2html } from 'text-plugin/App/functions/html2json'

export default async ({ tokenized }, callback) => {
  console.log(tokenized)

  var x = `<span id="s_lQglFhcs">This is a trial</span> <span id="w_rdG04e8KM">This</span> <span id="w_oTFi0xj-5">is a</span> <span id="w_lvvVF3mO-">trial</span>`

  // x = html2json(x)
  const results = x.split(/(<span.*?<\/span>)/g).map(x => {
    var y = x.match(/<span id="(.*?)">(.*?)<\/span>/);
    if (!y) return null;
    return {
      id: y[0],
      text: y[1]
    }
  }).filter(Boolean)
  callback({
    type: 'GOOGLE_TRANSLATE',
    translation: results,
  })

  // let sentences_html = ''
  // let words_html = ''
  // tokenized.forEach(paragraph => {
  //   paragraph.sentences.forEach(sentence => {
  //     sentences_html += `<span id="${sentence.id}">${sentence.text}</span>\n`
  //     sentence.words.forEach(word => {
  //       words_html += word.id ? `<span id="${word.id}">${word.text}</span>` : word
  //     })
  //   })
  // })
  // const html = `<div>${sentences_html}</div>\n<div>${words_html}</div>`
  // if (!html.trim()) return;
  // if (!GOOGLE_API_PROJECT_ID) return console.error('No Google API project ID')
  // const translationClient = new TranslationServiceClient()
  // const request = {
  //   parent: translationClient.locationPath(GOOGLE_API_PROJECT_ID, 'global'),
  //   contents: [html],
  //   mimeType: 'text/html', // mime types: text/plain, text/html
  //   sourceLanguageCode: 'is-IS',
  //   targetLanguageCode: 'en-US',
  // }
  // const [response] = await translationClient.translateText(request)
  // // for (const translation of response.translations) {
  // //   console.log(`Translation: ${translation.translatedText}`)
  // // }
  // console.log(response)
  // callback({
  //   type: 'GOOGLE_TRANSLATE',
  //   translation: response,
  // })
}
