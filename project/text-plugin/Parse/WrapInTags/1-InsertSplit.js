import { html2json, json2html } from 'text-plugin/App/functions/html2json'
// import SplitIntoUnicodeCharacters from './helpers/runes'
// import { getTextFromTokenized } from 'project/server/api/translate/tokenizer/create-ids'

/*
  STEP 1:

  Adds "{{SPLIT HERE}}" in the tree
*/

export default function(input, tokenizedSplit) {

  // Turn tokenized data into an array of text
  const array = tokenizedSplit.map(getTextFromTokenized)

  // console.warn(split)

  let currentIndex = 0
  let locationInString = 0
  const InsertSPLIT = (i) => {
    if (Array.isArray(i)) {
      return i.map(x => InsertSPLIT(x))
    } else {
      const { node, tag, attr, child, text } = i
      if (node === 'element' || node === 'root') {
        return {
          ...i,
          child: child && child.map(x => InsertSPLIT(x))
        }
      } else if (node === 'text') {

        /*
          Split text into individual characters
        */
        return {
          ...i,
          text: text
            .split('')
            .map(character => {

              /*
                Surrounding spaces and characters like soft hyphens
                may have been stripped away.
                Here we just return characters until we see the one we are looking for.
              */
              if (character !== array[currentIndex][locationInString]) {
                return character
              }

              /*
                When we have finished looping through each character in the current array string
                we insert a delimeter, here the text "{{SPLIT HERE}}".
                (Assumes empty strings have been filtered out)
              */
              if (locationInString + character.length === array[currentIndex].length && currentIndex + 1 < array.length) {
                locationInString = 0
                currentIndex++
                return character + '{{SPLIT HERE}}'
              } else {
                locationInString += character.length
                return character
              }
            }).join(''),
        }
      }
      return i
    }
  }

  /*
    Turns the JSON into a HTML string
    (which includes "{{SPLIT HERE}}" in the correct places)
  */
  const html = json2html({
    node: 'root',
    child: InsertSPLIT(input)
  })

  return html
}


export const getTextFromTokenized = (t) => {
  if (Array.isArray(t)) {
    return t.map(getTextFromTokenized).join('')
  }
  if (typeof t === 'object') {
    return t.text
  }
  return t
}
