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
import store from 'App/store'
import isEmpty from 'is-empty-object'

/*
  Parser
*/
export default function(html) {
  if (!html) return null
  // console.log(html)
  try {
    html = html.replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    html = entities.decode(html)
    html = html.replace(/[\s\n\r]+/g, ' ')
    let json = html2json(html)
    /* Debug: */
    // console.log(json2html(json))
    // console.log(json)
    // console.log(JSON.stringify(json,null,2))
    // console.log(html)
    // console.log(json2html(json))

    /*
      Is data already saved?
    */
    let data = ExtractData(json)
    // console.log(data)

    /*
      Extract text, group by documents
    */
    const text = ExtractText(json)
    // console.log(text)
    if(isEmpty(text)) {
      console.warn('No text to tokenize.')
      return json
      // return html2json(Compiler({ json: wrapped, data: data, }))
    }
    const tokenized = Tokenizer(text, data)
    // console.log(tokenized)
    const flattenedData = flattenData(data)
    // console.log(tokenized)
    store.dispatch({
      type: 'TOKENIZED',
      currentDocument: tokenized[mw.config.get( 'wgTitle' )],
      // allDocuments: tokenized,
      data: flattenedData,
      currentDocumentData: data[mw.config.get( 'wgTitle' )],
    })

    /*
      Merge tokenization and HTML (does not include data).
      Returns wrapped HTML without data
    */
    const wrapped = WrapInTags({ json, tokenized })
    // console.log(json2html(wrapped))
    const compiled = Compiler({ json: wrapped, data: flattenedData })
    return html2json(compiled)
    // return compiled
  } catch (e) {
    console.error(e)
  }
}





const flattenData = (input) => {
  let translation = {
    definitions: {},
    sentences: {},
    words: {},
  }
  let list = {
    arrayOfAllItemIDs: [],
    arrayOfAllWordIDs: [],
    items: {},
    sentences: {},
    words: {},
  }

  for (const documentTitle of Object.keys(input)) {
    const currentTranslation = input[documentTitle].translation
    const currentList = input[documentTitle].list
    // console.log(input[documentTitle])
    translation = {
      definitions: { ...translation.definitions, ...currentTranslation.definitions },
      sentences: { ...translation.sentences, ...currentTranslation.sentences },
      words: { ...translation.words, ...currentTranslation.words },
    }
    list = {
      arrayOfAllItemIDs: [...list.arrayOfAllItemIDs,...currentList.arrayOfAllItemIDs],
      arrayOfAllWordIDs: [...list.arrayOfAllWordIDs, ...currentList.arrayOfAllWordIDs],
      items: { ...list.items, ...currentList.items },
      sentences: { ...list.sentences, ...currentList.sentences },
      words: { ...list.words, ...currentList.words },
    }
  }
  return {
    translation,
    list,
  }
}
