// @ts-ignore
import getParameter from "get-parameter";
import { isBrowser } from "modules/isBrowser";
import { AnyAction, combineReducers } from "redux";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import { long_audio } from "ylhyra/documents/translationEditor/audioSynchronization/frontend/reducers";

import { autosave } from "ylhyra/documents/translationEditor/main/actions";
import {
  selected,
  translation,
} from "ylhyra/documents/translationEditor/main/translator/reducers";
import short_audio from "ylhyra/documents/translationEditor/NOT_USED/shortAudio.NOT_USED/reducers";
import { TokenizedParagraphs } from "ylhyra/documents/types/various";

const isOpen = isBrowser ? getParameter("editor") : false;
const open = (state: string | Boolean = isOpen, action: AnyAction) => {
  switch (action.type) {
    case "OPEN_EDITOR":
      return action.page as string;
    case "CLOSE_EDITOR":
      return false;
    default:
      return state;
  }
};

const parsed = (state: HtmlAsJson | null = null, action: AnyAction) => {
  switch (action.type) {
    case "INITIALIZE_WITH_TOKENIZED_AND_DATA":
      return (action.parsed as HtmlAsJson) || state;
    default:
      return state;
  }
};

const tokenized = (state: TokenizedParagraphs = [], action: AnyAction) => {
  switch (action.type) {
    case "INITIALIZE_WITH_TOKENIZED_AND_DATA":
      return (action.currentDocument as TokenizedParagraphs) || state;
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
