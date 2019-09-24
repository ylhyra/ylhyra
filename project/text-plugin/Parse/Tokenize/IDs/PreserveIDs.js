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


export default (first, second) => {

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


/*
  Input: Two arrays of only IDs & text.
  Ouput: Map of new IDs to preserved IDs
*/
const DiffAndPreserveIDs = (first, second) => {
  let ids = {}
  let first_index = 0
  let second_index = 0

  const diff = diffArrays(
    first.map(i => i.text),
    second.map(i => i.text),
  )
  // console.log(JSON.stringify(diff,null,2))
  diff.forEach((part, index) => {
    part.value.forEach(value => {
      if (part.removed) {
        first_index++
      } else if (part.added) {
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
          }).filter(Boolean).join('/') // Random joining character
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



// setTimeout(() => {
//   TESTING()
// }, 100)
//
// const One = [{
//     "hash": "1a545us",
//     "sentences": [{
//       "id": "s_1a545_preserved",
//       "text": "Þetta er dæmi um texta.",
//       "words": [{
//           "0": "Þ",
//           "1": "e",
//           "2": "t",
//           "3": "t",
//           "4": "a",
//           "id": "w_2ya30_preserved",
//           "text": "Þetta"
//         },
//         " ",
//         {
//           "0": "e",
//           "1": "r",
//           "id": "w_leyzt_preserved",
//           "text": "er"
//         },
//         " ",
//         {
//           "0": "d",
//           "1": "æ",
//           "2": "m",
//           "3": "i",
//           "id": "w_11omt_preserved",
//           "text": "dæmi"
//         },
//         " ",
//         {
//           "0": "u",
//           "1": "m",
//           "id": "w_vd9nq_preserved",
//           "text": "um"
//         },
//         " ",
//         {
//           "0": "t",
//           "1": "e",
//           "2": "x",
//           "3": "t",
//           "4": "a",
//           "id": "w_w3cfr_preserved",
//           "text": "texta"
//         }
//       ]
//     }]
//   },
//   {
//     "hash": "zrhs5d",
//     "sentences": [{
//       "id": "s_zrhs5_preserved",
//       "text": "Hér er meiri texti.",
//       "words": [{
//           "0": "H",
//           "1": "é",
//           "2": "r",
//           "id": "w_r09qh_preserved",
//           "text": "Hér"
//         },
//         " ",
//         {
//           "0": "e",
//           "1": "r",
//           "id": "w_lgaou_preserved",
//           "text": "er"
//         },
//         " ",
//         {
//           "0": "m",
//           "1": "e",
//           "2": "i",
//           "3": "r",
//           "4": "i",
//           "id": "w_1ox2q_preserved",
//           "text": "meiri"
//         },
//         " ",
//         {
//           "0": "t",
//           "1": "e",
//           "2": "x",
//           "3": "t",
//           "4": "i",
//           "id": "w_1ln62_preserved",
//           "text": "texti"
//         }
//       ]
//     }]
//   }
// ]
//
// const Two = [{
//     "hash": "1hkjp5k",
//     "sentences": [{
//       "id": "s_1hkjp_NEW",
//       "text": "Þetta hérna er dæmi um texta.",
//       "words": [{
//           "0": "Þ",
//           "1": "e",
//           "2": "t",
//           "3": "t",
//           "4": "a",
//           "id": "w_1pavt_NEW",
//           "text": "Þetta"
//         },
//         " ",
//         {
//           "0": "h",
//           "1": "é",
//           "2": "r",
//           "3": "n",
//           "4": "a",
//           "id": "w_tcpm2_NEW",
//           "text": "hérna"
//         },
//         " ",
//         {
//           "0": "e",
//           "1": "r",
//           "id": "w_mkgw6_NEW",
//           "text": "er"
//         },
//         " ",
//         {
//           "0": "d",
//           "1": "æ",
//           "2": "m",
//           "3": "i",
//           "id": "w_10gna_NEW",
//           "text": "dæmi"
//         },
//         " ",
//         {
//           "0": "u",
//           "1": "m",
//           "id": "w_u73v0_NEW",
//           "text": "um"
//         },
//         " ",
//         {
//           "0": "t",
//           "1": "e",
//           "2": "x",
//           "3": "t",
//           "4": "a",
//           "id": "w_urp9o_NEW",
//           "text": "texta"
//         }
//       ]
//     }]
//   },
//   {
//     "hash": "1bsuioi",
//     "sentences": [{
//         "id": "s_104gi_NEW",
//         "text": "Viðbót.",
//         "words": [{
//           "0": "V",
//           "1": "i",
//           "2": "ð",
//           "3": "b",
//           "4": "ó",
//           "5": "t",
//           "id": "w_sr0a5_NEW",
//           "text": "Viðbót"
//         }]
//       },
//       {
//         "id": "s_zrhs5_NEW",
//         "text": "Hér er meiri texti.",
//         "words": [{
//             "0": "H",
//             "1": "é",
//             "2": "r",
//             "id": "w_r09qh_NEW",
//             "text": "Hér"
//           },
//           " ",
//           {
//             "0": "e",
//             "1": "r",
//             "id": "w_lgaou_NEW",
//             "text": "er"
//           },
//           " ",
//           {
//             "0": "m",
//             "1": "e",
//             "2": "i",
//             "3": "r",
//             "4": "i",
//             "id": "w_1ox2q_NEW",
//             "text": "meiri"
//           },
//           " ",
//           {
//             "0": "t",
//             "1": "e",
//             "2": "x",
//             "3": "t",
//             "4": "i",
//             "id": "w_1ln62_NEW",
//             "text": "texti"
//           }
//         ]
//       },
//       {
//         "id": "s_kc61n_NEW",
//         "text": "Og þetta líka.",
//         "words": [{
//             "0": "O",
//             "1": "g",
//             "id": "w_rm1kg_NEW",
//             "text": "Og"
//           },
//           " ",
//           {
//             "0": "þ",
//             "1": "e",
//             "2": "t",
//             "3": "t",
//             "4": "a",
//             "id": "w_qaft8_NEW",
//             "text": "þetta"
//           },
//           " ",
//           {
//             "0": "l",
//             "1": "í",
//             "2": "k",
//             "3": "a",
//             "id": "w_12eq5_NEW",
//             "text": "líka"
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "hash": "1ji8d5c",
//     "sentences": [{
//       "id": "s_1ji8d_NEW",
//       "text": "Aukabót.",
//       "words": [{
//         "0": "A",
//         "1": "u",
//         "2": "k",
//         "3": "a",
//         "4": "b",
//         "5": "ó",
//         "6": "t",
//         "id": "w_1g3iy_NEW",
//         "text": "Aukabót"
//       }]
//     }]
//   }
// ]
