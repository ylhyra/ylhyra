/*
  TODO:
  It is most often unnecessary to use "Words" and "Sentences",
  we should instead only rely on the more general "Items".
*/
export default (paragraphs) => {

  let items = {}
  let arrayOfAllItemIDs = []
  let sentences = {}
  let words = {}
  let arrayOfAllWordIDs = []

  paragraphs.forEach(paragraph => {
    paragraph.sentences.forEach(sentence => {
      sentences[sentence.id] = sentence
      items[sentence.id] = sentence
      arrayOfAllItemIDs.push(sentence.id)
      sentence.words.forEach(word => {
        if(word.id) {
          word = {
            ...word,
            belongsToSentence: sentence.id,
          }
          words[word.id] = word
          items[word.id] = word
          arrayOfAllWordIDs.push(word.id)
          arrayOfAllItemIDs.push(word.id)
        }
      })
    })
  })

  return {
    items, // Object containing all words and all sentences
    arrayOfAllItemIDs, // Array of all words and all sentences

    sentences, // Object of only sentences
    words, // Object of only words
    arrayOfAllWordIDs, // Array of all word I
  }
}
