import { combineReducers } from "redux";
import {
  getFromLocalStorage,
  saveInLocalStorage,
} from "app/app/functions/localStorage";

const deck = (state = null, action) => {
  switch (action.type) {
    case "LOAD_DECK":
      return action.content;
    default:
      return state;
  }
};

const overview = (state = {}, action) => {
  switch (action.type) {
    case "LOAD_OVERVIEW":
      return action.content;
    default:
      return state;
  }
};

const card = (state = {}, action) => {
  switch (action.type) {
    case "LOAD_CARD":
      return {
        ...action.content,
        answered: false,
      };
    case "ANSWER_CARD":
      return {
        ...state,
        answered: true,
      };
    default:
      return state;
  }
};

const volume = (
  state = getFromLocalStorage("volume") !== "off",
  // state = process.env.NODE_ENV !== "development" &&
  // getFromLocalStorage("volume") !== "off",
  action
) => {
  switch (action.type) {
    case "VOCABULARY_AUDIO_ONOFF":
      saveInLocalStorage("volume", !state ? "on" : "off");
      return !state;
    default:
      return state;
  }
};

export const vocabulary = combineReducers({
  deck,
  card,
  volume,
  overview,
});
