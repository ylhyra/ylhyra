import store from "app/app/store";
import hash from "string-hash";
import _ from "underscore";

/*
  If the user has selected several non-adjacent words,
  we need to keep track of the recent selections so we know which word to jump to next.
*/
let recentlySelected = [];

export const nextWord = (direction, isAdding) => (dispatch, getState) => {
  const selected = getState().editor.selected;
  const arrayOfAllWordIDs = getState().editor.list.arrayOfAllWordIDs;

  if (selected.length > 1) {
    // TODO - If the selections are non-adjacent we need to find out where to jump to next based on recentlySelected
  }

  if (selected.length === 0) {
    // dispatch(selectWord(window.lastSelectedWord || arrayOfAllWordIDs[0]))
  } else if (direction === "next" || !direction) {
    const last = selected[selected.length - 1];
    const index = arrayOfAllWordIDs.indexOf(last);
    const nextIndex = index + 1;
    if (nextIndex === arrayOfAllWordIDs.length) return;
    const nextSelected = arrayOfAllWordIDs[nextIndex];
    dispatch(selectWord(nextSelected, isAdding));
  } else if (direction === "previous") {
    const first = selected[0];
    const index = arrayOfAllWordIDs.indexOf(first);
    const prevIndex = index - 1;
    if (prevIndex < 0) return;
    const prevSelected = arrayOfAllWordIDs[prevIndex];
    dispatch(selectWord(prevSelected, isAdding));
  }
};

export const selectWord = (id, adding) => (dispatch, getState) => {
  const translation = getState().editor.translation;
  const definition = translation.definitions[translation.words[id]];
  const containsMany = definition?.contains.length > 1;
  recentlySelected = _.uniq([id, ...recentlySelected]).slice(0, 5);

  // Select
  if (containsMany)
    dispatch({
      type: "SELECT_WORD",
      contains: definition.contains,
      arrayOfAllWordIDs: store.getState().editor.list.arrayOfAllWordIDs,
    });
  else {
    dispatch({
      type: "SELECT_WORD",
      id,
      adding,
      arrayOfAllWordIDs: store.getState().editor.list.arrayOfAllWordIDs,
    });
  }
};

export const clearSelection = () => ({ type: "CLEAR_SELECTION" });

/* Update entire definition object at once */
export const updateDefinition =
  ({ definition, selected }) =>
  (dispatch) => {
    dispatch({
      type: "UPDATE_DEFINITION",
      definition,
      selected,
    });
  };
/* Update only one part of definition object */
export const updateDefinitionValue =
  ({ name, value }) =>
  (dispatch, getState) => {
    const selected = getState().editor.selected;
    dispatch({
      type: "UPDATE_DEFINITION_VALUE",
      name,
      value,
      selected,
    });
  };
export const updateSentence = (data) => (dispatch) => {
  dispatch({
    type: "UPDATE_SENTENCE_VALUE",
    sentence_id: data.sentence_id,
    fieldName: data.fieldName || "meaning",
    value: data.value,
  });
};

export const deleteWord = (id) => ({
  type: "DELETE_WORD",
  id,
});

export const wordsHash = (ids) => hash(ids.join("")).toString(36);
