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
          tokenization: RemoveSpaces(sentence.words),
        }
      }
    })
  })

  await input_sentences.forEachAsync(async ({ id, text }) => {
    await new Promise(resolve => {
      Tokenizer(text, (output) => {
        // console.log(output)
        output_sentences[id].analysis = RemoveSpaces(output[0])
        resolve()
      })
    })
  })

  // console.log(JSON.stringify(output_sentences))

  callback({
    type: 'SUGGEST_ANALYSIS',
    suggestions: merge_tokenization_and_analysis_to_create_suggestions(output_sentences),
  })
}

export default Tokenize

/*
  Merges the two on the format:
  [{
    ids: []
    analysis: []
  }]
*/
const merge_tokenization_and_analysis_to_create_suggestions = (sentences) => {
  let output = []
  // return console.log(JSON.stringify(sentences))
  Object.keys(sentences).forEach(sentence_id => {
    const sentence = sentences[sentence_id]
    const { tokenization, analysis } = sentence

    let w_index = 0
    const w_text_array = tokenization.map(word => (word.text || word).trim().replace(/ /g, ''))
    const a_text_array = analysis.map(x => (x.text || x).trim().replace(/ /g, '')) // Tries to match ignoring spaces
    /*
      TODO: Assumes our tokenization is less greedy than the analysis
    */
    a_text_array.forEach((a_word, a_index) => {
      let output_ids = []
      let output_analysis = []
      if (a_word === w_text_array[w_index]) {
        output_ids.push(tokenization[w_index].map(i => i.id))
        output_analysis.push(analysis[a_index])
        w_index++
      } else if (a_word.startsWith(w_text_array[w_index])) {
        let temp_word = ''
        let temp_output_ids = []
        while (temp_word !== a_word && w_index <= w_text_array.length) {
          temp_word += w_text_array[w_index]
          temp_output_ids.push(tokenization[w_index].map(i => i.id))
          w_index++
          // console.log({ temp_word, a_word })
        }
        if (temp_word === a_word) {
          output_ids.push(...temp_output_ids)
          output_analysis.push(analysis[a_index])
        }
      } else {
        console.warn('COULD NOT MATCH: ' + a_word)
        w_index++
      }
      if (true || output_ids.length > 0) {
        output.push({
          ids: output_ids,
          analysis: output_analysis,
        })
      }
    })
    // console.log(JSON.stringify(output, null, 2))
  })
  return output
}

const RemoveSpaces = (array) => {
  return array.filter(x => !(typeof x === 'string' && x.trim() === ''))
}
