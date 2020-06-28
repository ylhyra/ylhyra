/*

  - Compares old and new tokenization and attempts to preserve IDs.
  - This is done to prevent loss of translations when editing the input text.

  Input:
    1. Old tokenized text
    2. New tokenised text
  Output:
    1. New tokenized text with preserved IDs when possible


  TODO sometime in the future:
  - Compare string similarity and thus preserve
    items which have only changed a little
*/

import { diffArrays } from 'diff'
import flattenArray from 'App/functions/flattenArray'
// import store from 'App/store'
// import stringSimilarity from 'string-similarity'
// var similarity = stringSimilarity.compareTwoStrings('healed', 'sealed');
// var matches = stringSimilarity.findBestMatch('healed', ['edward', 'sealed', 'theatre']);
const JOINING_CHARACTER = '�' // Random joining character

const Preserve = (first, second) => {
  /*
    Map from new IDs to preserved IDs
  */
  const PreservedIDs = {
    /*
      Compares old and new sentences
    */
    ...DiffAndPreserveIDs(SentencesArray(first), SentencesArray(second)),
    /*
      Compares old and new words
    */
    ...DiffAndPreserveIDs(WordsArray(first), WordsArray(second))
  }
  // console.log({PreservedIDs})

  // console.error(SentencesArray(first))
  // console.error(SentencesArray(second))
  // console.error(JSON.stringify(WordsArray(first)))
  // console.error(JSON.stringify(WordsArray(second)))

  // DiffAndPreserveIDs(SentencesArray(first), SentencesArray(second))

  /*
    Return with preserved IDs
  */
  return second.map(paragraph => ({
    ...paragraph,
    sentences: paragraph.sentences.map(sentence => ({
      ...sentence,
      id: PreservedIDs[sentence.id] || sentence.id,
      words: sentence.words.map(word => {
        if (!word.id) return word
        return {
          ...word,
          id: PreservedIDs[word.id] || word.id,
        }
      })
    }))
  }))
}
export default Preserve



/*
  Input: Two arrays of only IDs & text.
  Ouput: Map of new IDs to preserved IDs
*/
const DiffAndPreserveIDs = (first, second) => {
  let ids = {}
  let first_index = 0
  let second_index = 0
  // console.log(first)
  const diff = diffArrays(
    first.map(i => i.text),
    second.map(i => i.text),
  )
  // console.log(JSON.stringify(diff, null, 2))
  diff.forEach((part, index) => {
    part.value.forEach(value => {
      if (part.removed) {
        // console.log(first[first_index].text + ' removed')
        first_index++
      } else if (part.added) {
        // console.log(second[second_index].text + ' added')
        second_index++
      } else {
        /*
          Map new ID to preserved ID
        */
        ids[second[second_index].id] = first[first_index].id
        first_index++
        second_index++
      }
    })

    /*
      TODO: Attempt to find the closest match
    */
    // if (diff[index + 1] && (
    //     (diff[index].removed && diff[index + 1].added) ||
    //     (diff[index].added && diff[index + 1].removed)
    //   )) {
    //   console.log(part)
    // }
  })
  // console.log(ids)
  return ids
}





/*
  Create flat arrays of words and sentences.

  Input:
    - Tokenized data
  Output:
    - Simplified array on the form: [{ id, text }, { id, text }].
    - All punctuation is removed to make diff simpler.
*/
const SentencesArray = (paragraphs) => {
  return flattenArray(
    paragraphs.map(paragraph => {
      return paragraph.sentences.map(sentence => {
        return {
          id: sentence.id,
          text: sentence.words.map(word => {
            return word.text
          }).filter(Boolean).join(JOINING_CHARACTER)
        }
      })
    }))
}
const WordsArray = (paragraphs) => {
  return flattenArray(
    paragraphs.map(paragraph => {
      return paragraph.sentences.map(sentence => {
        return sentence.words.map(word => {
          if (!word.id) return null
          return {
            id: word.id,
            text: word.text,
          }
        }).filter(Boolean)
      })
    }))
}



//
// const ONE = [{
//     "id": "w__Eiríkur",
//     "text": "Eiríkur"
//   },
//   {
//     "id": "w__dansar",
//     "text": "dansar"
//   },
//   {
//     "id": "w__svo",
//     "text": "svo"
//   },
//   {
//     "id": "w__vel",
//     "text": "vel"
//   }, {
//     "id": "w__Hann",
//     "text": "Hann"
//   }, {
//     "id": "w__dansar",
//     "text": "dansar"
//   }, {
//     "id": "w__betur",
//     "text": "betur"
//   }, {
//     "id": "w__en",
//     "text": "en"
//   }, {
//     "id": "w__ég",
//     "text": "ég"
//   }
// ]
// const TWO = [{
//   "id": "NEW_w__Test",
//   "text": "Test"
// }, {
//   "id": "NEW_w__test",
//   "text": "test"
// }, {
//   "id": "NEW_w__test",
//   "text": "test"
// }, {
//   "id": "NEW_w__Haha",
//   "text": "Haha"
// }, {
//   "id": "NEW_w__Haha",
//   "text": "Haha"
// }, {
//   "id": "NEW_w__Eiríkur",
//   "text": "Eiríkur"
// }, {
//   "id": "NEW_w__dansar",
//   "text": "dansar"
// }, {
//   "id": "NEW_w__svo",
//   "text": "svo"
// }, {
//   "id": "NEW_w__vel",
//   "text": "vel"
// }, {
//   "id": "NEW_w__Hann",
//   "text": "Hann"
// }, {
//   "id": "NEW_w__dansar",
//   "text": "dansar"
// }, {
//   "id": "NEW_w_0_betur",
//   "text": "betur"
// }, {
//   "id": "NEW_w_7_en",
//   "text": "en"
// }, {
//   "id": "NEW_w_O_ég",
//   "text": "ég"
// }]
//
// console.log({ DiffAndPreserveIDs: DiffAndPreserveIDs(ONE, TWO) })
