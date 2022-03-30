"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vocabularyMaker = void 0;
const redux_1 = require("redux");
const data = (state = null, action) => {
    switch (action.type) {
        case "LOAD_VOCABULARY_MAKER_DATA":
            return action.content.slice(0, 20);
        default:
            return state;
    }
};
const selected = (state = null, action) => {
    switch (action.type) {
        case "VOCABULARY_MAKER_SELECT":
            return action.content;
        default:
            return state;
    }
};
const word_to_record = (state = {
    word: null,
    remaining: null,
}, action) => {
    switch (action.type) {
        case "VOCABULARY_TO_RECORD":
            return action.content;
        default:
            return state;
    }
};
exports.vocabularyMaker = (0, redux_1.combineReducers)({
    data,
    selected,
    word_to_record,
});
