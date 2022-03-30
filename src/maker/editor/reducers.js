"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editor = void 0;
const isBrowser_1 = require("app/app/functions/isBrowser");
const List_1 = __importDefault(require("documents/parse/Tokenize/List"));
const get_parameter_1 = __importDefault(require("get-parameter"));
const reducers_1 = __importDefault(require("maker/editor/Long_audio/reducers"));
const reducers_2 = __importDefault(require("maker/editor/Short_audio/reducers"));
const reducers_3 = require("maker/editor/Suggestions/reducers");
const reducers_4 = require("maker/editor/Translator/reducers");
const redux_1 = require("redux");
let autosave;
if (typeof window !== "undefined") {
    autosave = require("maker/editor/actions").autosave;
}
const isOpen = isBrowser_1.isBrowser ? (0, get_parameter_1.default)("editor") : false;
const open = (state = isOpen, action) => {
    switch (action.type) {
        case "OPEN_EDITOR":
            return action.page;
        case "CLOSE_EDITOR":
            return false;
        default:
            return state;
    }
};
const parsed = (state = null, action) => {
    switch (action.type) {
        case "INITIALIZE_WITH_TOKENIZED_AND_DATA":
            return action.parsed || state;
        default:
            return state;
    }
};
const tokenized = (state = [], action) => {
    switch (action.type) {
        case "INITIALIZE_WITH_TOKENIZED_AND_DATA":
            return action.currentDocument || state;
        default:
            return state;
    }
};
const list = (state = {}, action) => {
    switch (action.type) {
        case "INITIALIZE_WITH_TOKENIZED_AND_DATA":
            if (action.currentDocument) {
                return (0, List_1.default)(action.currentDocument);
            }
            else {
                return state;
            }
        default:
            return state;
    }
};
const isSaved = (state = true, action) => {
    switch (action.type) {
        case "LOAD_EDITOR":
        case "SAVED":
            return true;
        case "AUDIO_SECTIONS":
        case "AUDIO_FILE":
        case "DELETE_WORD":
        case "PRONUNCIATION_AND_SOUND":
        case "SUGGEST":
        case "SYNC":
        case "UPDATE_DEFINITION_VALUE":
        case "UPDATE_DEFINITION":
        case "UPDATE_INPUT":
        case "UPDATE_METADATA_SINGLE":
        case "UPDATE_PARSED":
        case "UPDATE_SENTENCE_VALUE":
        case "SOUND_BITE_FILES":
        case "SOUND_BITE_FILE":
        case "SOUND":
            autosave === null || autosave === void 0 ? void 0 : autosave.on();
            return false;
        default:
            return state;
    }
};
exports.editor = (0, redux_1.combineReducers)({
    open,
    isSaved,
    tokenized,
    list,
    translation: // List of words and sentences
    reducers_4.translation,
    suggestions: reducers_3.suggestions,
    analysis: reducers_3.analysis,
    selected: reducers_4.selected,
    long_audio: // Selected words in the Editor
    reducers_1.default,
    short_audio: reducers_2.default,
    parsed,
    // audio,
    // pronunciation,
});
// import audio from 'Editor/4-Audio/reducers'
// import pronunciation from 'Editor/4-Audio/Pronunciation'
//
// const id = (state = null, action) => {
//   switch (action.type) {
//     case 'LOAD_EDITOR':
//       return action.content.id
//     default:
//       return state
//   }
// }
//
