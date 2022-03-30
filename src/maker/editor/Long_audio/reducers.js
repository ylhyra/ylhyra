"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = __importDefault(require("app/app/functions/hash"));
/*
  Long audio
*/
exports.default = (state = {}, action) => {
    const { filename } = action;
    switch (action.type) {
        case "INITIALIZE_WITH_TOKENIZED_AND_DATA":
            if (action.currentDocumentData) {
                return action.currentDocumentData.long_audio || {};
            }
            else {
                return state;
            }
        case "AUDIO_AREA":
            const xml_hash = hash(action.content);
            if (!filename) {
                return console.error("No filename!");
            }
            if (!action.content) {
                return Object.assign(Object.assign({}, state), { [filename]: {} });
            }
            if (xml_hash === state.xml_hash && action.filename === state.filename) {
                return state;
            }
            else {
                return Object.assign(Object.assign({}, state), { [filename]: {
                        xml_hash: xml_hash,
                        xml: action.content,
                        sync: null,
                    } });
            }
        case "SYNC":
            return Object.assign(Object.assign({}, state), { [filename]: Object.assign(Object.assign({}, (state[filename] || {})), { sync: action.content }) });
        default:
            return state;
    }
};
const hash = (input) => {
    return (0, hash_1.default)(input.replace(/^[A-zÀ-ÿ0-9/<>_-]/, ""));
};
