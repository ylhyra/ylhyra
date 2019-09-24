import sentence_tokenizer from './sentence-tokenizer'
import word_tokenizer from './word-tokenizer'

export default (input, callback) => {
  callback(
    sentence_tokenizer(input).map(sentence => {
      return word_tokenizer(sentence)
    })
  )
}
