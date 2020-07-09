/**

  Attempts to split Latin-script paragraphs into
  sentences of roughly 50 characters.

  It is preferable to do this with natural language processing.

  @returns An array of sentences

*/

import r from 'xregexp'
const startOfSentence = '(?:\\p{Uppercase letter}|[„"¿(])'
const endOfSentence = '[.!?;]+?(?:[“")])? '

export default (input) => {
  return input
    // Split on new sentences
    .replace(r(`(${endOfSentence})(${startOfSentence})`, 'g'), '$1\n\n$2')

    // Remove splits inside parantheses
    .replace(r(`(\\(.*?)\n\n(.*?\\))`, 'g'), '$1$2')

    // // (I actually don't know why this is here, can probably be removed?)
    // .replace(r(`(\\(.{20,}\\)[.,;:?!"”] ?)`, 'g'), '\n\n$1\n\n')

    // Split in the middle of sentences (if preceded by at least 20 characters)
    .replace(r(`([^.,;:?!"”]{20,}[,:] )([^.,;:?!"”]{20,})`, 'g'), '$1\n\n$2')

    // // Split spaces
    // .replace(/ \n\n/g, '\n\n \n\n')

    .split(/\n\n+/g)
    .filter(Boolean)
}
