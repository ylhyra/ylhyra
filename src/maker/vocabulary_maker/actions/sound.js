"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSound = exports.getNextWordToRecord = exports.setupSound = void 0;
const store_1 = __importDefault(require("app/app/store"));
const deck_1 = require("app/vocabulary/actions/deck");
const dependencies_1 = require("app/vocabulary/actions/functions/dependencies");
const actions_1 = require("maker/vocabulary_maker/actions/actions");
const functions_1 = require("maker/vocabulary_maker/compile/functions");
const underscore_1 = __importDefault(require("underscore"));
let missing_sound = [];
let current_word_recording = 0;
const setupSound = () => {
    if ((0, functions_1.getDeckName)())
        return;
    let sentences = [];
    /** @type {Array.<string>} */
    let ids = underscore_1.default.shuffle(deck_1.deck.cards_sorted.filter((c) => c.sortKey))
        .sort((a, b) => Math.floor(a.sortKey / 50) - Math.floor(b.sortKey / 50))
        .map((c) => c.id);
    ids = (0, dependencies_1.withDependencies)(ids);
    ids.forEach((id) => {
        if (!(id in actions_1.Database.cards))
            return;
        actions_1.Database.cards[id].spokenSentences.forEach((sentence) => {
            if (!sentences.includes(sentence)) {
                sentences.push(sentence);
            }
        });
    });
    // console.log(sentences);
    // sentences = _.shuffle(sentences);
    missing_sound = [];
    current_word_recording = 0;
    actions_1.Database.sound = actions_1.Database.sound.map((i) => (Object.assign(Object.assign({}, i), { lowercase: (0, functions_1.GetLowercaseStringForAudioKey)(i.recording_of) })));
    // Object.keys(plaintext_sentences)
    sentences.forEach((word) => {
        const lowercase = (0, functions_1.GetLowercaseStringForAudioKey)(word);
        if (!actions_1.Database.sound.some((i) => i.lowercase === lowercase &&
            i.speaker === window.recording_metadata.speaker)) {
            missing_sound.push(word);
        }
    });
    (0, exports.getNextWordToRecord)();
};
exports.setupSound = setupSound;
const getNextWordToRecord = () => {
    const remaining = `${current_word_recording} done today, ${missing_sound.length - current_word_recording} remaining. ${100 -
        Math.ceil(((missing_sound.length - current_word_recording) /
            Object.keys(actions_1.Database.plaintext_sentences).length) *
            100)}% done overall.`;
    const word = missing_sound[current_word_recording++];
    store_1.default.dispatch({
        type: "VOCABULARY_TO_RECORD",
        content: {
            word,
            remaining,
        },
    });
};
exports.getNextWordToRecord = getNextWordToRecord;
const saveSound = ({ word, filename }) => {
    console.log(filename);
    actions_1.Database.sound.push({
        recording_of: word,
        filename,
        speed: window.recording_metadata.speed,
        speaker: window.recording_metadata.speaker,
        date: new Date().toISOString().substring(0, 10),
    });
    (0, actions_1.save)();
};
exports.saveSound = saveSound;
