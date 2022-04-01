import { sortByArray } from "modules/sortByArray";
import store from "ylhyra/app/app/store";
import isEmpty from "is-empty-object";
import { send } from "ylhyra/maker/editor/web-socket";
import _ from "underscore";

// import { saveEditor } from 'Editor/actions'

export const findSoundBites = async () => {
  const { tokenized, translation, list } = store.getState().editor;

  // console.log(tokenized)

  if (isEmpty(list.words)) {
    return console.warn("List was not made!");
  }

  let wordID_to_text = {};
  let words = [];
  let sentences = [];
  tokenized.forEach((paragraph) => {
    paragraph.sentences.forEach((sentence) => {
      sentences.push(sentence.text);
      sentence.words.forEach((word) => {
        if (word.id) {
          const id = word.id;
          const definition = translation.definitions[translation.words[id]];
          if (definition && !definition.hide_pronunciation) {
            const text = getTextFromIDs([id, ...definition.contains], list)
              .trim()
              .toLowerCase();
            words.push(text);
            wordID_to_text[word.id] = text;
          } else {
            // words.push(word.text.trim().toLowerCase())
          }
        }
      });
    });
  });

  words = _.uniq(words).filter(Boolean);
  // sentences = _.uniq(sentences).filter(Boolean)

  // console.log(words)
  if (words.length > 0) {
    store.dispatch({
      type: "SOUND_BITE_LIST",
      soundList: words,
      wordID_to_text,
    });
    words.length &&
      send({
        type: "SOUND",
        missingSound: words,
      });
  } else {
    console.log("No sounds to update");
    store.dispatch({
      type: "SOUND_BITE_IS_UPDATED",
    });
  }
};

const getTextFromIDs = (ids, list) => {
  return sortByArray(_.uniq(ids), list.arrayOfAllWordIDs)
    .map((i) => list.words[i]?.text || list.words[i]?.sentence)
    .join(" ");
};

//
// export default async () => {
//   return new Promise(async resolve => {
//
//     // if (from !== 'isl') {
//     //   resolve(input)
//     //   return;
//     // }
//
//     /*
//       Find words needing pronunciation
//     */
//     const wordsAndPhrases = FindText(input, list)
//
//     /*
//       Request from server
//     */
//     const text = _.uniq(Object.values(wordsAndPhrases))
//     const missingPronunciation = _.difference(text, Object.keys(pronunciation))
//     const missingSound = _.difference(text, Object.keys(sound))
//     let output
//     if ((missingPronunciation.length > 0 || missingSound.length > 0)) {
//       console.log(`%c [Requesting pronunciation for ${missingPronunciation.length} words...]`,'color: RoyalBlue')
//       console.log(`%c [Requesting sound for ${missingSound.length} words...]`,'color: RoyalBlue')
//       output = (await axios.post('/api/audio/pronunciation_and_sound', {
//         missingPronunciation,
//         missingSound,
//       })).data
//     }
//
//     /*
//       Merge output with IDs
//     */
//     let idsToOutput = {}
//     for (const id of Object.keys(wordsAndPhrases)) {
//       const text = wordsAndPhrases[id]
//       if (text) {
//         idsToOutput[id] = {
//           pronunciation: pronunciation[text] || (output?.pronunciation[text]),
//           sound: sound[text] || (output?.sound[text]),
//         }
//       }
//     }
//
//     if ((output && Object.keys(output.pronunciation).length > 0) || (output && Object.keys(output.sound).length > 0)) {
//       store?.dispatch({
//         type: 'PRONUNCIATION_AND_SOUND',
//         pronunciation: output?.pronunciation,
//         sound: output?.sound,
//       })
//     }
//
//     /*
//       Put output into HTML
//     */
//     resolve(MergeOutputWithHTML(input, idsToOutput))
//   })
// }
//
//
// const FindText = (input, list) => {
//   let wordsAndPhrases = {}
//
//   const Traverse = (i) => {
//     if (!i) return i
//     const { node, tag, attr, child } = i
//     if (node === 'element' || node === 'root') {
//       const id = (attr?.id) || null
//       const definition = (attr?.definition) || null
//       if (tag === 'word' /*|| tag === 'sentence'*/ ) {
//         if (definition && !definition.hide_pronunciation) {
//           const text = getTextFromIDs([id, ...definition.contains], list).toLowerCase()
//           wordsAndPhrases[id] = text
//         }
//       }
//       child?.map(e => Traverse(e))
//     }
//     return i
//   }
//   Traverse(input)
//
//   return wordsAndPhrases
// }
//
// const MergeOutputWithHTML = (input, idsToOutput) => {
//   if (!input) return input
//   const { node, tag, attr, child, text } = input
//   const id = (attr?.id) || null
//   const definition = (attr?.definition) || null
//   if (tag === 'sentence' || tag === 'word') {
//     return {
//       ...input,
//       child: child?.map(e => MergeOutputWithHTML(e, idsToOutput)),
//       attr: {
//         ...attr,
//         definition: definition && {
//           ...definition,
//           ...idsToOutput[id] || {}
//         }
//       },
//     }
//   }
//   return {
//     ...input,
//     child: child?.map(e => MergeOutputWithHTML(e, idsToOutput)),
//   }
// }
//
// const getTextFromIDs = (ids, list) => {
//   return _.uniq(ids)
//     .sortByArray(list.arrayOfAllWordIDs)
//     .map(i => list.words[i].text || list.words[i].sentence)
//     .join(' ')
// }
