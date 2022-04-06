import { AnyAction } from "redux";
import string_hash from "modules/hash";
import {
  LongAudioReducer,
  XmlForAeneas,
} from "ylhyra/documents/translationEditor/audioSynchronization/types";

export const long_audio = (state: LongAudioReducer = {}, action: AnyAction) => {
  const filename: string = action.filename;
  switch (action.type) {
    case "INITIALIZE_WITH_TOKENIZED_AND_DATA":
      if (action.currentDocumentData) {
        return action.currentDocumentData.long_audio || {};
      } else {
        return state;
      }
    case "AUDIO_AREA":
      const xml_hash = adHocHashForAeneasXml(action.content);
      if (!filename) {
        return console.error("No filename!");
      }
      if (!action.content) {
        return {
          ...state,
          [filename]: {},
        };
      }
      if (
        xml_hash === state[filename].xml_hash &&
        action.filename === state.filename
      ) {
        return state;
      } else {
        return {
          ...state,
          [filename]: {
            xml_hash: xml_hash,
            xml: action.content,
            sync: null,
          },
        };
      }
    case "SYNC":
      return {
        ...state,
        [filename]: {
          ...(state[filename] || {}),
          sync: action.content,
        },
      };
    default:
      return state;
  }
};

const adHocHashForAeneasXml = (input: XmlForAeneas) => {
  return string_hash(input.replace(/^[A-zÀ-ÿ0-9/<>_-]/, ""));
};
