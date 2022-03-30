"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vocabulary = void 0;
const localStorage_1 = require("app/app/functions/localStorage");
const redux_1 = require("redux");
const deck = (state = null, action) => {
    switch (action.type) {
        case "LOAD_DECK":
            return action.content;
        default:
            return state;
    }
};
const user_level_in_interface_tmp = (state = null, action) => {
    switch (action.type) {
        case "SET_USER_LEVEL":
            return action.content;
        default:
            return state;
    }
};
const overview = (state = {}, action) => {
    switch (action.type) {
        case "LOAD_OVERVIEW":
            return Object.assign(Object.assign({}, state), action.content);
        default:
            return state;
    }
};
const card = (state = {}, action) => {
    switch (action.type) {
        case "NEW_CARD_IN_INTERFACE":
            return {
                counter: action.content,
                answered: false,
            };
        case "ANSWER_CARD":
            return Object.assign(Object.assign({}, state), { answered: true });
        default:
            return state;
    }
};
const volume = (
// state = getFromLocalStorage("volume") !== "off",
state = process.env.NODE_ENV !== "development" &&
    (0, localStorage_1.getFromLocalStorage)("volume") !== "off", action) => {
    switch (action.type) {
        case "VOCABULARY_AUDIO_ONOFF":
            (0, localStorage_1.saveInLocalStorage)("volume", !state ? "on" : "off");
            return !state;
        default:
            return state;
    }
};
exports.vocabulary = (0, redux_1.combineReducers)({
    deck,
    card,
    volume,
    overview,
    user_level_in_interface_tmp,
});
