/*

 __        __                  _          _
 \ \      / / __ __ _ _ __    (_)_ __    | |_ __ _  __ _ ___
  \ \ /\ / / '__/ _` | '_ \   | | '_ \   | __/ _` |/ _` / __|
   \ V  V /| | | (_| | |_) |  | | | | |  | || (_| | (_| \__ \
    \_/\_/ |_|  \__,_| .__/   |_|_| |_|   \__\__,_|\__, |___/
                     |_|                           |___/

 1. Parses input
 2. Loops over tokenization
 3. Merges tokenization and HTML to produce <sentence/> and <word/> tags

---

  We split up Words and Sentences based on raw text, not based on HTML structure.

  The purpose of these functions is to turn this HTML:
      <b>Blabla bla! <i>Bla</i></b> bla bla.
  Into:
      <sentence>
        <b>Blabla bla!</b>
      </sentence>
      <sentence>
        <b><i>Bla</i></b> bla bla.
      </sentence>

  That is to say, it breaks out of HTML tags at the correct spots in
  order to encapsulate the text into <sentence/> tags.

*/

import { html2json, json2html } from 'text-plugin/App/functions/html2json'
import { getText } from 'text-plugin/Parse/ExtractText/ExtractText'

import InsertSplit from './1-InsertSplit'
import SplitAndWrap from './2-SplitAndWrap'
import InvertElementsThatOnlyContainOneThing from './3-Invert'
import MergeElementsThatHaveBeenSplitUnnecessarily from './4-Merge'
import GroupParagraphs from 'text-plugin/Parse/ExtractText/Paragraphs'
import { newTitle } from 'Parse/index.js'

/*
  Parse input and split paragraphs
*/
export default function({ json, tokenized }) {

  /*
    Flatten tokenized
  */
  let tokenizedFlattened = []
  for (const documentTitle of Object.keys(tokenized)) {
    tokenized[documentTitle].forEach(d => {
      tokenizedFlattened.push({
        documentTitle,
        ...d,
      })
    })
  }
  tokenizedFlattened = tokenizedFlattened.sort((a, b) => a.index - b.index)

  // console.log(tokenized)

  let index = 0
  let wrapped = GroupParagraphs({
    input: json,
    getNewTitle: new newTitle(),
    paragraphFunction: (paragraph, documentTitle) => {
      const text = getText(paragraph, true, true)
      // console.log(text)
      if (documentTitle === undefined) {
        return paragraph
      }
      if (text) {
        return Sentences(paragraph, tokenizedFlattened[index++].sentences)
      }
    },
  })
  // console.log(wrapped)
  wrapped = RemoveData(wrapped)
  // console.log(wrapped)
  wrapped = html2json(json2html(wrapped))

  return wrapped
}

/*
  Extract sentences from paragraph
*/
const Sentences = (paragraph_HTML, sentences) => {
  /*
    Extract words from sentence
    (Creates a function that will be called in "WrapInTags.js")
  */
  let i = 0

  function Words(sentence_HTML) {
    const words = sentences[i++].words
    return WrapInTags(sentence_HTML, words, 'word')
  }

  return WrapInTags(paragraph_HTML, sentences, 'sentence', Words).child
}


const WrapInTags = (input, tokenizedSplit, elementName, innerFunction) => {
  let html, json
  const temp_attribute_name = innerFunction ? `data-temp-id` : `data-temp-id2`

  if (tokenizedSplit.length === 0) return input;

  html = InsertSplit(input, tokenizedSplit)
  json = SplitAndWrap(html, tokenizedSplit, elementName, innerFunction, temp_attribute_name)
  json = InvertElementsThatOnlyContainOneThing(json)
  json = MergeElementsThatHaveBeenSplitUnnecessarily(json, temp_attribute_name)

  return json
}

/*
  Removes the inline data printed in [[Template:Start]]
*/
const RemoveData = (input) => {
  if (!input) return input
  if (Array.isArray(input)) {
    return input.map(RemoveData)
  }
  const { node, tag, attr, child, text } = input
  if (node === 'element' || node === 'root') {
    if (attr && (attr["data-document-start"] || attr["data-document-end"])) {
      return { node: "text", text: "" } // Hlýtur að vera betri leið til að henda út greinum...
    }
    if (child) {
      return {
        ...input,
        child: child.map((e, i) => RemoveData(e, i))
      }
    }
    return input
  }
  return input
}
