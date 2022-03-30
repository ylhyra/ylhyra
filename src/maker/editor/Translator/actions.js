"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordsHash = exports.deleteWord = exports.updateSentence = exports.updateDefinitionValue = exports.updateDefinition = exports.clearSelection = exports.selectWord = exports.nextWord = void 0;
const store_1 = __importDefault(require("app/app/store"));
const string_hash_1 = __importDefault(require("string-hash"));
const underscore_1 = __importDefault(require("underscore"));
/*
  If the user has selected several non-adjacent words,
  we need to keep track of the recent selections so we know which word to jump to next.
*/
let recentlySelected = [];
const nextWord = (direction, isAdding) => (dispatch, getState) => {
    const selected = getState().editor.selected;
    const arrayOfAllWordIDs = getState().editor.list.arrayOfAllWordIDs;
    if (selected.length > 1) {
        // TODO - If the selections are non-adjacent we need to find out where to jump to next based on recentlySelected
    }
    if (selected.length === 0) {
        // dispatch(selectWord(window.lastSelectedWord || arrayOfAllWordIDs[0]))
    }
    else if (direction === "next" || !direction) {
        const last = selected[selected.length - 1];
        const index = arrayOfAllWordIDs.indexOf(last);
        const nextIndex = index + 1;
        if (nextIndex === arrayOfAllWordIDs.length)
            return;
        const nextSelected = arrayOfAllWordIDs[nextIndex];
        dispatch((0, exports.selectWord)(nextSelected, isAdding));
    }
    else if (direction === "previous") {
        const first = selected[0];
        const index = arrayOfAllWordIDs.indexOf(first);
        const prevIndex = index - 1;
        if (prevIndex < 0)
            return;
        const prevSelected = arrayOfAllWordIDs[prevIndex];
        dispatch((0, exports.selectWord)(prevSelected, isAdding));
    }
};
exports.nextWord = nextWord;
const selectWord = (id, adding) => (dispatch, getState) => {
    const translation = getState().editor.translation;
    const definition = translation.definitions[translation.words[id]];
    const containsMany = (definition === null || definition === void 0 ? void 0 : definition.contains.length) > 1;
    recentlySelected = underscore_1.default.uniq([id, ...recentlySelected]).slice(0, 5);
    // Select
    if (containsMany)
        dispatch({
            type: "SELECT_WORD",
            contains: definition.contains,
            arrayOfAllWordIDs: store_1.default.getState().editor.list.arrayOfAllWordIDs,
        });
    else {
        dispatch({
            type: "SELECT_WORD",
            id,
            adding,
            arrayOfAllWordIDs: store_1.default.getState().editor.list.arrayOfAllWordIDs,
        });
    }
};
exports.selectWord = selectWord;
const clearSelection = () => ({ type: "CLEAR_SELECTION" });
exports.clearSelection = clearSelection;
/* Update entire definition object at once */
const updateDefinition = ({ definition, selected }) => (dispatch) => {
    dispatch({
        type: "UPDATE_DEFINITION",
        definition,
        selected,
    });
};
exports.updateDefinition = updateDefinition;
/* Update only one part of definition object */
const updateDefinitionValue = ({ name, value }) => (dispatch, getState) => {
    const selected = getState().editor.selected;
    dispatch({
        type: "UPDATE_DEFINITION_VALUE",
        name,
        value,
        selected,
    });
};
exports.updateDefinitionValue = updateDefinitionValue;
const updateSentence = (data) => (dispatch) => {
    dispatch({
        type: "UPDATE_SENTENCE_VALUE",
        sentence_id: data.sentence_id,
        fieldName: data.fieldName || "meaning",
        value: data.value,
    });
};
exports.updateSentence = updateSentence;
const deleteWord = (id) => ({
    type: "DELETE_WORD",
    id,
});
exports.deleteWord = deleteWord;
const wordsHash = (ids) => (0, string_hash_1.default)(ids.join("")).toString(36);
exports.wordsHash = wordsHash;
