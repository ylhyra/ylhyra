"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestionsStatus = exports.applySuggestions = exports.receiveSuggestions = exports.request = void 0;
const store_1 = __importDefault(require("app/app/store"));
const web_socket_1 = require("maker/editor/web-socket");
const react_1 = __importDefault(require("react"));
// import GoogleTranslate from './GoogleTranslate'
/*

  - Checks which words/sentences are missing:
      1. Our suggestions
      2. GoogleTranslate
  - Then requests those things in batches.

*/
let started = false; // TEMPORARY!!! NEEDS TO BE REWORKED
const request = () => {
    if (started)
        return; // TEMP!
    started = true; // TEMP!
    const { list, tokenized } = store_1.default.getState().editor;
    // Information is sent through a WebSocket
    console.log("%c [Requesting suggestions...]", "color: RoyalBlue");
    (0, web_socket_1.send)({
        type: "REQUEST_SUGGESTIONS",
        list: list,
        tokenized: tokenized,
        // from: metadata.from,
        // to: metadata.to,
    });
    // GoogleTranslate()
};
exports.request = request;
/*
  Receives response from server.
  Dispatches suggestions.
*/
const receiveSuggestions = (action) => {
    let items = {};
    action.content.forEach((suggestion) => {
        if (!items[suggestion.item_id]) {
            items[suggestion.item_id] = [];
        }
        items[suggestion.item_id].push(Object.assign(Object.assign({}, suggestion), { also_part_of_definition: suggestion.also_part_of_definition &&
                suggestion.also_part_of_definition
                    .split(",")
                    .map((a) => parseInt(a))
                    .concat([0])
                    .sort((a, b) => a - b), definition: JSON.parse(suggestion.definition) }));
    });
    store_1.default.dispatch({
        type: "SUGGEST",
        content: items,
    });
};
exports.receiveSuggestions = receiveSuggestions;
const applySuggestions = () => {
    const { list, translation, suggestions } = store_1.default.getState().editor;
    for (let id of Object.keys(suggestions)) {
        if (!(id in translation.words) && !(id in translation.sentences)) {
            if (id in list.words) {
                store_1.default.dispatch({
                    type: "UPDATE_DEFINITION",
                    definition: suggestions[id][0].definition,
                    selected: [id], // TODO!! "INCLUDES OTHER WORDS"
                });
            }
            else {
                store_1.default.dispatch({
                    type: "UPDATE_SENTENCE",
                    content: suggestions[id][0].definition,
                    sentence_id: id,
                });
            }
        }
    }
};
exports.applySuggestions = applySuggestions;
class SuggestionsStatus extends react_1.default.PureComponent {
    render() {
        return null;
    }
}
exports.SuggestionsStatus = SuggestionsStatus;
