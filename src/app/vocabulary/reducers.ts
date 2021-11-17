import { combineReducers } from "redux";
import {
  getFromLocalStorage,
  saveInLocalStorage,
} from "app/app/functions/localStorage";
import Deck from "app/vocabulary/actions/deck";

const deck = (state = null, action) => {
  switch (action.type) {
    case "LOAD_DECK":
      return action.content;
    default:
      return state;
  }
};

const user_level_in_interface_tmp = (state = null, action) => {
  switch (action.type) {
    case "SET_USER_LEVEL":
      return action.content;
    default:
      return state;
  }
};

const overview = (state = {}, action) => {
  switch (action.type) {
    case "LOAD_OVERVIEW":
      return {
        ...state,
        ...action.content,
      };
    default:
      return state;
  }
};

export interface CardReducer {
  counter?: number;
  answered?: boolean;
}
const card = (state: CardReducer = {}, action) => {
  switch (action.type) {
    case "NEW_CARD_IN_INTERFACE":
      return {
        counter: action.content,
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
  // state = getFromLocalStorage("volume") !== "off",
  state = process.env.NODE_ENV !== "development" &&
    getFromLocalStorage("volume") !== "off",
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

export interface VocabularyReducer {
  deck: Deck;
  card: CardReducer;
  volume: boolean;
  overview: any;
}
export const vocabulary = combineReducers({
  deck,
  card,
  volume,
  overview,
  user_level_in_interface_tmp,
});