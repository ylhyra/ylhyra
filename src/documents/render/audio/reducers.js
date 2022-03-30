"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.audio = void 0;
const audio = (state = {}, action) => {
    switch (action.type) {
        case "CURRENTLY_PLAYING":
            return Object.assign(Object.assign({}, state), { currentlyPlaying: action.content });
        case "PLAY_SENTENCE":
            return Object.assign(Object.assign({}, state), { currentlyPlaying: action.filename, begin: action.begin, end: action.end });
        case "CLEAR_SENTENCE":
            return Object.assign(Object.assign({}, state), { begin: null, end: null });
        default:
            return state;
    }
};
exports.audio = audio;
