"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pronunciation = (state = {}, action) => {
    switch (action.type) {
        case "LOAD_EDITOR":
            return action.content.pronunciation || state;
        case "PRONUNCIATION_AND_SOUND":
            return Object.assign(Object.assign({}, state), action.pronunciation);
        default:
            return state;
    }
};
exports.default = pronunciation;
