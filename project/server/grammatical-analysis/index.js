import icelandic from 'server/grammatical-analysis/icelandic'
// import CreateIDs from './create-ids'
// import List from './list'
require('project/text-plugin/App/functions/array-foreach-async')
import { wordRegex } from 'project/text-plugin/Parse/Tokenize/IDs/CreateIDs.js'

/*
  Input: Regex based tokenization
  Output: Lexical analysis based on natural language processing, including part-of-speech tags

  We merge regex-based and NLP-based tokenization because Greynir can return very long sentences and misplaced punctuation marks.
*/
const Tokenize = async ({ tokenized }, callback) => {
  let Tokenizer = icelandic
  let input_sentences = []
  let output_sentences = []

  tokenized.forEach(paragraph => {
    paragraph.sentences.forEach(sentence => {
      if (wordRegex.test(sentence.text)) {
        input_sentences.push({
          id: sentence.id,
          text: sentence.text,
          tokenization: sentence.words,
        })
      }
    })
  })

  await input_sentences.forEachAsync(async ({ id, text }) => {
    await new Promise(resolve => {
      Tokenizer(text, (output) => {
        console.log(output)
        output_sentences.push({
          id,
          words: output,
        })
        resolve()
      })
    })
  })

  output_sentences = merge(input_sentences, output_sentences)

  // output_sentences = CreateIDs(output_sentences)

  callback({
    type: 'ANALYSIS',
    tokenized: output_sentences,
    // list: List(output_sentences),
  })
}

export default Tokenize

const merge = (input_sentences, output_sentences) => {
  return output_sentences
}
