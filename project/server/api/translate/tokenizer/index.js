import default_tokenizer from 'tagger/server/api/translate/tokenizer/default-tokenizer'
// import icelandic from 'tagger/server/api/translate/tokenizer/icelandic'
// import CreateIDs from './create-ids'
// import List from './list'
require('project/tagger/frontend/src/App/functions/array-foreach-async')

const Tokenize = async ({ lang, paragraphs }, callback) => {
  let output_paragraphs = []

  let Tokenizer = default_tokenizer
  /*
    TODO:
    Although the Greynir.is tokenizer is good,
    we would need to merge it with the output of naive tokenizing.
    Otherwise we can end up with very long sentences, and misplaced punctuation marks.
  */
  // if (lang === 'isl' && process.env.NODE_ENV === 'production') {
  //   Tokenizer = icelandic
  // }

  await paragraphs.forEachAsync(async ({ hash, text }) => {
    await new Promise(resolve => {
      Tokenizer(text, (output) => {
        output_paragraphs.push({
          hash,
          sentences: output,
        })
        resolve()
      })
    })
  })

  // output_paragraphs = CreateIDs(output_paragraphs)

  callback({
    type: 'TOKENIZED',
    tokenized: output_paragraphs,
    // list: List(output_paragraphs),
  })
}

export default Tokenize
