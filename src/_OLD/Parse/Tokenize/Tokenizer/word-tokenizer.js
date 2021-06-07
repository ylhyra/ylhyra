/**

  Attempts to split Latin-script sentences into words.

  It is preferable to do this with natural language processing.

  @returns An array of words

*/

import r from 'xregexp'
const startOfWord = '[A-zÀ-ÿ·-]'
const middleOfWord = '[A-zÀ-ÿ·\\-\'’.,:0-9]'
const endOfWord = '[A-zÀ-ÿ·\\-\']'

export const wordRegex = r(`((?:${startOfWord}(?:(?:${middleOfWord}+)?${endOfWord})?)|[0-9]+)`, 'g')

export default (input) => {
  return input
    .split(wordRegex)
    .filter(Boolean)
}
