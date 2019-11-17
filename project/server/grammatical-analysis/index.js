import icelandic from 'server/grammatical-analysis/icelandic'
// import CreateIDs from './create-ids'
// import List from './list'
require('project/text-plugin/App/functions/array-foreach-async')
import { wordRegex } from 'project/text-plugin/Parse/Tokenize/IDs/CreateIDs.js'
// import { diffArrays } from 'diff'

/*
  Input: Regex based tokenization
  Output: Lexical analysis based on natural language processing, including part-of-speech tags

  We merge regex-based and NLP-based tokenization because Greynir can return very long sentences and misplaced punctuation marks.
*/
const Tokenize = async ({ tokenized }, callback) => {
  let Tokenizer = icelandic
  let input_sentences = []
  let output_sentences = {}

  tokenized.forEach(paragraph => {
    paragraph.sentences.forEach(sentence => {
      if (wordRegex.test(sentence.text)) {
        input_sentences.push({
          id: sentence.id,
          text: sentence.text,
        })
        output_sentences[sentence.id] = {
          tokenization: sentence.words,
        }
      }
    })
  })

  await input_sentences.forEachAsync(async ({ id, text }) => {
    await new Promise(resolve => {
      Tokenizer(text, (output) => {
        console.log(output)
        output_sentences[id].analysis = output
        resolve()
      })
    })
  })

  console.log(JSON.stringify(output_sentences))

  // callback({
  //   type: 'SUGGEST_ANALYSIS',
  //   suggestions: merge_tokenization_and_analysis_to_create_suggestions(output_sentences),
  // })
}

export default Tokenize


const merge_tokenization_and_analysis_to_create_suggestions = (sentences) => {
  let suggestions = []
  // console.log(JSON.stringify(sentences))
  Object.keys(sentences).forEach(sentence_id => {
    const sentence = sentences[sentence_id]
    const { tokenization } = sentence
    const analysis = sentence.analysis[0]
    const w_text_array = tokenization.map(word => (word.text || word).trim())
    const a_text_array = analysis.map(x => (x.text || x).trim())
    let w_index = 0
    // let a_index = 0
    // console.log(w_text_array)
    // console.log(a_text_array)
    // let done = false
    let groups = []
    // /*
    //   Assumes our tokenization is less greedy than the analysis
    // */
    // a_text_array.forEach((a_word, index) => {
    //   if (a_word === w_text_array[w_index]) {
    //
    //   } else if (a_word.startsWith(w_text_array[w_index])) {
    //     let w_word = w_text_array[w_index]
    //     for (; w_word.length < a_word.length; w_index++) {
    //       w_word += w_text_array[w_index]
    //     }
    //     console.log(w_word)
    //   }
    //   w_index++
    // })


    //
    //
    //
    //
    // tokenization.forEach(word => {
    //   if (word.id) {
    //     console.log(word.text)
    //     if (word.text === analysis[currentPositionInAnalysis].text) {
    //
    //     }
    //     // suggestions.push({
    //     //   selected: [word.id],
    //     //   definition: {
    //     //     meaning: 'test',
    //     //   }
    //     // })
    //   }
    // })
  })
  // return suggestions
}



// /*
//   When we have finished looping through each character in the current array string
//   we insert a delimeter, here the text "{{SPLIT HERE}}".
//   (Assumes empty strings have been filtered out)
// */
// if (locationInString + character.length === array[currentIndex].length && currentIndex + 1 < array.length) {
//   locationInString = 0
//   currentIndex++
//   return character + '{{SPLIT HERE}}'
// } else {
//   locationInString += character.length
//   return character
// }
