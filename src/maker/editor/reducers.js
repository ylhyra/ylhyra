import { combineReducers } from "redux";
import { selected, translation } from "maker/editor/Translator/reducers";
import { analysis, suggestions } from "maker/editor/Suggestions/reducers";
import MakeList from "documents/parse/Tokenize/List";
import long_audio from "maker/editor/Long_audio/reducers";
import short_audio from "maker/editor/Short_audio/reducers";
import getParameter from "get-parameter";
import { isBrowser } from "app/app/functions/isBrowser";

let autosave;
if (typeof window !== "undefined") {
  autosave = require("maker/editor/actions").autosave;
}

const isOpen = isBrowser ? getParameter("editor") : false;
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
        return MakeList(action.currentDocument);
      } else {
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
      autosave?.on();
      return false;
    default:
      return state;
  }
};

export const editor = combineReducers({
  open,
  isSaved,
  tokenized,
  list, // List of words and sentences
  translation,
  suggestions,
  analysis,
  selected, // Selected words in the Editor
  long_audio,
  short_audio,
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
