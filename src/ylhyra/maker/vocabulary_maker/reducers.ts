import { combineReducers } from "redux";

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
const word_to_record = (
  state = {
    word: null,
    remaining: null,
  },
  action
) => {
  switch (action.type) {
    case "VOCABULARY_TO_RECORD":
      return action.content;
    default:
      return state;
  }
};

export const vocabularyMaker = combineReducers({
  data,
  selected,
  word_to_record,
});
