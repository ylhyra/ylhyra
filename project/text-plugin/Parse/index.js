/*
  ____                        _                   _
 |  _ \ __ _ _ __ ___  ___   (_)_ __  _ __  _   _| |_
 | |_) / _` | '__/ __|/ _ \  | | '_ \| '_ \| | | | __|
 |  __/ (_| | |  \__ \  __/  | | | | | |_) | |_| | |_
 |_|   \__,_|_|  |___/\___|  |_|_| |_| .__/ \__,_|\__|
                                     |_|

  Input:  HTML
  Output: JSON representation of HTML

  Sends this output to the next function,
  which will look for paragraphs in the text.

*/

import { html2json, json2html } from 'text-plugin/App/functions/html2json'
import markdown from 'marked'
import { AllHtmlEntities as Entities } from 'html-entities'
import ExtractData from './ExtractData'
import ExtractText from './ExtractText/ExtractText'
import Tokenizer from './Tokenize'
import WrapInTags from './WrapInTags'
import Compiler from './Compiler'
const entities = new Entities()
import NotifyError from 'App/Error'
// import store from 'App/store'
import isEmpty from 'is-empty-object'
var now = require("performance-now")

/*
  Parser
*/
export default async ({ html, title }) => {
  if (!html) return null
  // console.log(html)
  try {
    var t0 = now()
    html = entities.decode(html)
    html = html
      .replace(/[\s\n\r]+/g, ' ') // Ef þetta er fjarlægt virkar WrapInTags/SplitAndWrap ekki
      // .replace(/\u00AD/g,' ') //Soft-hyphens
      // .replace(/\u00A0/g,' ') //Non-breaking spaces
      .replace(/<\/?mw:toc>/g, '') //Mediawiki clutter
      .replace(/<mw:editsection.*?<\/mw:editsection>/g, '') //Mediawiki clutter
    let json = html2json(html)

    // var t1 = now()
    // console.log(`html2json took ${Math.round(t1 - t0)} ms`)

    // json = json2html(html)
    // json = html2json(html)
    // console.log(json)
    // return json
    /* Debug: */
    // console.log(json2html(json))
    // console.log(json)
    // console.log(JSON.stringify(json,null,2))
    // console.log(html)
    // console.log(json2html(json))


    /*
      Is data already saved?
    */
    let data = await ExtractData(json)
    // console.warn('----->-->>>>>>>>>>>>>>>>>>>>>>>>>\n>>>>>>>>>>>>>>>>>>>>-')
    // console.warn(data)
    // var t2 = now()
    // console.log(`Extracting data took ${Math.round(t2 - t1)} ms`)

    /*
      Extract text, group by documents
    */
    const text = ExtractText(json)
    // var t3 = now()
    // console.log(`Extracting text took ${Math.round(t3 - t2)} ms`)
    if (isEmpty(text)) {

      // console.warn('No text to tokenize.')
      // json = html2json(entities.decode(json2html(json)))
      return ({ parsed: json })
      // return html2json(Compiler({ json: wrapped, data: data, }))
    }
    const tokenized = Tokenizer(text, data)
    // var t4 = now()
    // console.log(`Tokenization took ${Math.round(t4 - t3)} ms`)
    const flattenedData = flattenData(data)
    // console.log(text)
    // console.log({
    //   text,
    //   tokenized,
    //   data,
    //   flattenedData,
    // })




    /*
      Merge tokenization and HTML (does not include data).
      Returns wrapped HTML without data
    */
    // console.log(json2html(json))
    const wrapped = WrapInTags({ json, tokenized })
    // console.log({wrapped})
    // var t5 = now()
    // console.log(`Wrapping took ${Math.round(t5 - t4)} ms`)
    // console.log(json2html(wrapped))
    let compiled = Compiler({ json: wrapped, data: flattenedData })
    // console.log({compiled})
    // var t6 = now()
    // console.log(`Tokenization took ${Math.round(t6 - t5)} ms`)
    // compiled = entities.decode(compiled)
    // console.log(compiled)
    // console.log(compiled)
    return {
      parsed: html2json(compiled),
      tokenized,
      data,
      flattenedData
    }
    // return compiled
  } catch (e) {
    console.error(e)
    if (typeof mw !== 'undefined') {
      NotifyError('Error in parse step')
    }
  }
}





const flattenData = (input) => {
  let output = {
    translation: {
      definitions: {},
      sentences: {},
      words: {},
    },
    list: {
      arrayOfAllItemIDs: [],
      arrayOfAllWordIDs: [],
      items: {},
      sentences: {},
      words: {},
    },
    short_audio: {
      soundList: [],
      sounds: {},
      wordID_to_text: {},
    }
  }

  for (const documentTitle of Object.keys(input)) {
    output = merge(output, input[documentTitle])
  }
  return output
}
const merge = (first, second) => {
  if (Array.isArray(first)) {
    return [...first, ...second]
  } else if (typeof first === 'object') {
    let output = first
    if (second && typeof second === 'object') {
      for (const key of Object.keys(second)) {
        if (output[key]) {
          output[key] = merge(output[key], second[key])
        } else {
          output[key] = second[key]
        }
      }
    }
    return output
  }
}


// const currentTranslation = input[documentTitle].translation
// const currentList = input[documentTitle].list
// const currentShortaudio = input[documentTitle].short_audio
// // console.log(input[documentTitle])
// translation = {
//   definitions: { ...translation.definitions, ...currentTranslation.definitions },
//   sentences: { ...translation.sentences, ...currentTranslation.sentences },
//   words: { ...translation.words, ...currentTranslation.words },
// }
// list = {
//   arrayOfAllItemIDs: [...list.arrayOfAllItemIDs, ...currentList.arrayOfAllItemIDs],
//   arrayOfAllWordIDs: [...list.arrayOfAllWordIDs, ...currentList.arrayOfAllWordIDs],
//   items: { ...list.items, ...currentList.items },
//   sentences: { ...list.sentences, ...currentList.sentences },
//   words: { ...list.words, ...currentList.words },
// }
// if (currentShortaudio) {
//   short_audio = {
//     soundList: [...short_audio.soundList, ...currentShortaudio.soundList],
//     sounds: { ...short_audio.sounds, ...currentShortaudio.sounds },
//     wordID_to_text: { ...short_audio.wordID_to_text, ...currentShortaudio.wordID_to_text },
//   }
// }

/*
  Prevent clashes if the same document is transcluded twice
*/
export class newTitle {
  index = 0;
  array = [];
  get(title) {
    if (this.array.includes(title)) {
      title = this.get(title + '1')
    }
    this.array.push(title)
    return title
  }
}
