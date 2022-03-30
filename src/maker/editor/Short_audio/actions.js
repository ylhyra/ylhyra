"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSoundBites = void 0;
const sortByArray_1 = require("app/app/functions/sortByArray");
const store_1 = __importDefault(require("app/app/store"));
const is_empty_object_1 = __importDefault(require("is-empty-object"));
const web_socket_1 = require("maker/editor/web-socket");
const underscore_1 = __importDefault(require("underscore"));
// import { saveEditor } from 'Editor/actions'
const findSoundBites = () => __awaiter(void 0, void 0, void 0, function* () {
    const { tokenized, translation, list } = store_1.default.getState().editor;
    // console.log(tokenized)
    if ((0, is_empty_object_1.default)(list.words)) {
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
                    }
                    else {
                        // words.push(word.text.trim().toLowerCase())
                    }
                }
            });
        });
    });
    words = underscore_1.default.uniq(words).filter(Boolean);
    // sentences = _.uniq(sentences).filter(Boolean)
    // console.log(words)
    if (words.length > 0) {
        store_1.default.dispatch({
            type: "SOUND_BITE_LIST",
            soundList: words,
            wordID_to_text,
        });
        words.length &&
            (0, web_socket_1.send)({
                type: "SOUND",
                missingSound: words,
            });
    }
    else {
        console.log("No sounds to update");
        store_1.default.dispatch({
            type: "SOUND_BITE_IS_UPDATED",
        });
    }
});
exports.findSoundBites = findSoundBites;
const getTextFromIDs = (ids, list) => {
    return (0, sortByArray_1.sortByArray)(underscore_1.default.uniq(ids), list.arrayOfAllWordIDs)
        .map((i) => { var _a, _b; return ((_a = list.words[i]) === null || _a === void 0 ? void 0 : _a.text) || ((_b = list.words[i]) === null || _b === void 0 ? void 0 : _b.sentence); })
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
