import shortid from 'shortid'
import hash from 'project/text-plugin/App/functions/hash'
require('array-sugar')

/*
  TODO
  Only tests for Latin text
*/
export const wordRegex = /[A-zÀ-ÿ0-9]/

const CreateIDs = (documentTitle, paragraphs) => {

  const seed = (hash(shortid.generate() + '' + documentTitle)).slice(0,4)
  let i = 0
  const makeID = () => {
    return `${seed}${i++}`
  }

  return paragraphs.map(paragraph => {
    /*
      Paragraph
    */
    return {
      index: paragraph.index,
      hash: paragraph.hash,
      sentences: paragraph.sentences.map(sentence => {
        /*
          Sentence
        */
        const sentenceText = getTextFromTokenized(sentence).trim()
        const sentenceId = makeID()
        const words = sentence.words || sentence // Sentence can either be an object or just an array of strings
        return {
          id: 's_' + sentenceId,
          text: sentenceText,
          words: words.map(word => {
            /*
              Word
            */
            const wordText = getTextFromTokenized(word).trim()
            if (!wordRegex.test(wordText)) return word;
            const wordId = makeID()
            return {
              id: 'w_' + wordId,
              text: wordText,
              // ...word,
            }
          })
          // Filter out empty ends
          .filter((word, index) =>
            !((index === 0 || index === sentence.length - 1) && !(word.text && word.text.trim()) && !word.trim())
          )
        }
      })
    }
  })
}

export default CreateIDs


/*
  Gets text from tokenized output
*/
export const getTextFromTokenized = (t) => {
  if (Array.isArray(t)) {
    return t.map(getTextFromTokenized).join('')
  }
  if (typeof t === 'object') {
    return t.text
  }
  return t
}
