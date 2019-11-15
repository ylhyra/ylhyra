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

  // callback({
  //   type: 'SUGGEST_ANALYSIS',
  //   suggestions: merge_tokenization_and_analysis_to_create_suggestions(output_sentences),
  // })
}

export default Tokenize

// merge_tokenization_and_analysis_to_create_suggestions2 = (sentences) => {
//   let suggestions = []
//   // console.log(JSON.stringify(sentences))
//   Object.keys(sentences).forEach(sentence_id => {
//     const sentence = sentences[sentence_id]
//     const { tokenization } = sentence
//     const analysis = sentence.analysis[0]
//     const w_text_array = tokenization.map(word => word.text || word)
//     const a_text_array = analysis.map(x => x.text || x)
//     let w_index = 0
//     let a_index = 0
//     console.log(w_text_array)
//     console.log(a_text_array)
//     let done = false
//     while (!done) {
//       if (w_text_array[w_index] === a_text_array[a_index]) {
//
//       } else if (w_text_array[w_index].length > a_text_array[a_index].length) {
//
//       } else if (w_text_array[w_index].length < a_text_array[a_index].length) {
//
//       }
//       console.log(w_text_array[w_index])
//       console.log(a_text_array[a_index])
//       done = true;
//     }
//
//
//     //
//     //
//     //
//     //
//     // tokenization.forEach(word => {
//     //   if (word.id) {
//     //     console.log(word.text)
//     //     if (word.text === analysis[currentPositionInAnalysis].text) {
//     //
//     //     }
//     //     // suggestions.push({
//     //     //   selected: [word.id],
//     //     //   definition: {
//     //     //     meaning: 'test',
//     //     //   }
//     //     // })
//     //   }
//     // })
//   })
//   // return suggestions
// }
// merge_tokenization_and_analysis_to_create_suggestions2(x)





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
