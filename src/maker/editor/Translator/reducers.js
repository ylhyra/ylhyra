"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translation = exports.selected = void 0;
const sortByArray_1 = require("app/app/functions/sortByArray");
const actions_1 = require("maker/editor/Translator/actions");
const underscore_1 = require("underscore");
/*
  ____       _           _   _
 / ___|  ___| | ___  ___| |_(_) ___  _ __
 \___ \ / _ \ |/ _ \/ __| __| |/ _ \| '_ \
  ___) |  __/ |  __/ (__| |_| | (_) | | | |
 |____/ \___|_|\___|\___|\__|_|\___/|_| |_|   */
const selected = (state = [], action) => {
    switch (action.type) {
        case "SELECT_WORD":
            // Eru mörg orð í þessu vali?
            if (action.contains) {
                return action.contains;
            }
            else if (action.id) {
                if (action.adding) {
                    const arrayOfAllWordIDs = action.arrayOfAllWordIDs;
                    return (0, sortByArray_1.sortByArray)((state = (0, underscore_1.uniq)([action.id, ...state])), arrayOfAllWordIDs);
                }
                else {
                    return (state = [action.id]);
                }
            }
            return state;
        case "CLEAR_SELECTION":
        case "CONFIRM_DEFINITION":
        case "DELETE_WORD":
            return (state = []);
        default:
            return state;
    }
};
exports.selected = selected;
/*
  _____                    _       _   _
 |_   _| __ __ _ _ __  ___| | __ _| |_(_) ___  _ __
   | || '__/ _` | '_ \/ __| |/ _` | __| |/ _ \| '_ \
   | || | | (_| | | | \__ \ | (_| | |_| | (_) | | | |
   |_||_|  \__,_|_| |_|___/_|\__,_|\__|_|\___/|_| |_|  */
const init = {
    sentences: {},
    words: {},
    definitions: {},
};
const translation = (state = init, action) => {
    switch (action.type) {
        case "INITIALIZE_WITH_TOKENIZED_AND_DATA":
            if (action.currentDocumentData) {
                return action.currentDocumentData.translation;
            }
            else {
                return init;
            }
        case "UPDATE_SENTENCE": {
            let { sentence_id, content } = action;
            return Object.assign(Object.assign({}, state), { sentences: Object.assign(Object.assign({}, state.sentences), { [sentence_id]: content }) });
        }
        case "UPDATE_SENTENCE_VALUE": {
            let { sentence_id, fieldName, value } = action;
            /* If user has deleted definition */
            if (!value) {
                let sentence = state.sentences[sentence_id] || {};
                sentence = (0, underscore_1.omit)(sentence, fieldName); // Clear field
                /* Is entire definition empty? */
                if (Object.keys(sentence).length === 0) {
                    /* Return object without sentence */
                    let sentences = state.sentences;
                    sentences = (0, underscore_1.omit)(sentences, sentence_id); // Clear field
                    return Object.assign(Object.assign({}, state), { sentences });
                }
                else {
                    /* Return sentence without the deleted field */
                    return Object.assign(Object.assign({}, state), { sentences: Object.assign(Object.assign({}, state.sentences), { [sentence_id]: sentence }) });
                }
            }
            return Object.assign(Object.assign({}, state), { sentences: Object.assign(Object.assign({}, state.sentences), { [sentence_id]: Object.assign(Object.assign({}, (state.sentences[sentence_id] || {})), { [fieldName]: value }) }) });
        }
        /*
            Update entire definition
          */
        case "UPDATE_DEFINITION": {
            const { definition, selected } = action;
            const hash = (0, actions_1.wordsHash)(selected);
            let words = {};
            for (let id of selected) {
                words[id] = hash;
            }
            return Object.assign(Object.assign({}, state), { words: Object.assign(Object.assign({}, state.words), words), definitions: Object.assign(Object.assign({}, state.definitions), { [hash]: Object.assign({ contains: selected }, definition) }) });
        }
        /*
            Update just one field in definition
          */
        case "UPDATE_DEFINITION_VALUE": {
            const { name, value, selected } = action;
            const hash = (0, actions_1.wordsHash)(selected);
            let words = {};
            for (let id of selected) {
                words[id] = hash;
            }
            /* If user has deleted definition */
            if (!value) {
                let definition = state.definitions[hash];
                definition = (0, underscore_1.omit)(definition, name); // Clear field
                /* Is entire definition empty? */
                if (Object.keys(definition).length <= 1) {
                    /* Return object without word */
                    return Object.assign(Object.assign({}, state), { words: (0, underscore_1.omit)(state.words, ...selected), definitions: (0, underscore_1.omit)(state.definitions, hash) });
                }
                else {
                    /* Return word without the deleted field */
                    return Object.assign(Object.assign({}, state), { words: Object.assign(Object.assign({}, state.words), words), definitions: Object.assign(Object.assign({}, state.definitions), { [hash]: Object.assign({ contains: selected }, definition) }) });
                }
            }
            return Object.assign(Object.assign({}, state), { words: Object.assign(Object.assign({}, state.words), words), definitions: Object.assign(Object.assign({}, state.definitions), { [hash]: Object.assign(Object.assign({}, state.definitions[hash]), { contains: selected, [name]: value }) }) });
        }
        case "DELETE_WORD": {
            const words = state.words;
            const definitions = state.definitions;
            const definitionId = words[action.id];
            const definition = definitions[definitionId];
            if (!definition) {
                return state;
            }
            definition.contains.forEach((word) => {
                delete words[word];
            });
            delete definitions[definitionId];
            return Object.assign(Object.assign({}, state), { words: Object.assign({}, words), definitions: Object.assign({}, definitions) });
        }
        default:
            return state;
    }
};
exports.translation = translation;
