"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextFromTokenized = exports.wordRegex = void 0;
const hash_1 = __importDefault(require("app/app/functions/hash"));
const shortid_1 = __importDefault(require("shortid"));
require("array-sugar");
/*
  TODO
  Only tests for Latin text
*/
exports.wordRegex = /[A-zÀ-ÿ0-9]/;
const CreateIDs = (documentTitle, paragraphs) => {
    const seed = (0, hash_1.default)(shortid_1.default.generate() + "" + documentTitle).slice(0, 4);
    let i = 0;
    const makeID = () => {
        return `${seed}${i++}`;
    };
    return paragraphs.map((paragraph) => {
        /*
          Paragraph
        */
        return {
            index: paragraph.index,
            hash: paragraph.hash,
            sentences: paragraph.sentences.map((sentence) => {
                /*
                  Sentence
                */
                const sentenceText = (0, exports.getTextFromTokenized)(sentence).trim();
                const sentenceId = makeID();
                const words = sentence.words || sentence; // Sentence can either be an object or just an array of strings
                return {
                    id: "s_" + sentenceId,
                    text: sentenceText,
                    words: words
                        .map((word) => {
                        /*
                        Word
                      */
                        const wordText = (0, exports.getTextFromTokenized)(word).trim();
                        if (!exports.wordRegex.test(wordText))
                            return word;
                        const wordId = makeID();
                        return {
                            id: "w_" + wordId,
                            text: wordText,
                            // ...word,
                        };
                    })
                        // Filter out empty ends
                        .filter((word, index) => {
                        var _a;
                        return !((index === 0 || index === sentence.length - 1) &&
                            !((_a = word.text) === null || _a === void 0 ? void 0 : _a.trim()) &&
                            !word.trim());
                    }),
                };
            }),
        };
    });
};
exports.default = CreateIDs;
/*
  Gets text from tokenized output
*/
const getTextFromTokenized = (t) => {
    if (Array.isArray(t)) {
        return t.map(exports.getTextFromTokenized).join("");
    }
    if (typeof t === "object") {
        return t.text;
    }
    return t;
};
exports.getTextFromTokenized = getTextFromTokenized;
