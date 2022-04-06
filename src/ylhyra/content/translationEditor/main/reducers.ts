import { AnyAction, combineReducers } from "redux";
// @ts-ignore
import getParameter from "get-parameter";
import { isBrowser } from "modules/isBrowser";
import MakeList from "ylhyra/content/documents/compileWithTranslation/Tokenize/List";
import { ListData, TokenizedParagraphsWithIds } from "ylhyra/content/types";
import { long_audio } from "ylhyra/content/translationEditor/audioSynchronization/frontend/reducers";
import short_audio from "ylhyra/content/translationEditor/NOT_USED/shortAudio.NOT_USED/reducers";
// import {
//   analysis,
//   suggestions,
// } from "ylhyra/maker/editor/Suggestions/reducers";
import {
  selected,
  translation,
} from "ylhyra/content/translationEditor/main/translator/reducers";

import { autosave } from "ylhyra/content/translationEditor/main/actions";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";

const isOpen = isBrowser ? getParameter("editor") : false;
const open = (state = isOpen, action: AnyAction) => {
  switch (action.type) {
    case "OPEN_EDITOR":
      return action.page;
    case "CLOSE_EDITOR":
      return false;
    default:
      return state;
  }
};

const parsed = (state: HtmlAsJson | null = null, action: AnyAction) => {
  switch (action.type) {
    case "INITIALIZE_WITH_TOKENIZED_AND_DATA":
      return action.parsed || state;
    default:
      return state;
  }
};

const tokenized = (
  state: TokenizedParagraphsWithIds = [],
  action: AnyAction
) => {
  switch (action.type) {
    case "INITIALIZE_WITH_TOKENIZED_AND_DATA":
      return action.currentDocument || state;
    default:
      return state;
  }
};

const list = (state: ListData | null = null, action: AnyAction) => {
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

const isSaved = (state = true, action: AnyAction) => {
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
      autosave.on();
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
  // suggestions,
  // analysis,
  selected, // Selected words in the Editor
  long_audio,
  short_audio,
  parsed,
  // audio,
  // pronunciation,
});
