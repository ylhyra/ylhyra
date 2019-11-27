const { TranslationServiceClient } = require('@google-cloud/translate').v3beta1;
const { GOOGLE_API_PROJECT_ID } = process.env
import { html2json, json2html } from 'text-plugin/App/functions/html2json'

export default async ({ tokenized }, callback) => {

  return ; //TEMP!
  let sentences_html = ''
  let words_html = ''
  tokenized.forEach(paragraph => {
    paragraph.sentences.forEach(sentence => {
      sentences_html += `<span id="${sentence.id}">${sentence.text}</span>\n`
      sentence.words.forEach(word => {
        words_html += word.id ? `<div id="${word.id}">${word.text}</div><br/>\n` : word
      })
    })
  })
  const html = `<div>${sentences_html}</div>\n<div>${words_html}</div>`
  if (!html.trim()) return;
  console.log(html)

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
  //   console.log(`Translation: ${translation.translatedText}`)
  // }
  // console.log(response)
  const translatedText = response?.translations[0]?.translatedText

  let results = {}
  translatedText && translatedText.split(/(<(?:span|div).*?<\/(?:span|div)>)/g).forEach(x => {
    var y = x.match(/<(?:span|div) id="(.*?)">(.*?)<\/(?:span|div)>/);
    if (!y) return null;
    const id = y[1]
    const text = y[2]
    results[id] = text
  })
  callback({
    type: 'GOOGLE_TRANSLATE',
    translation: results,
  })
}
