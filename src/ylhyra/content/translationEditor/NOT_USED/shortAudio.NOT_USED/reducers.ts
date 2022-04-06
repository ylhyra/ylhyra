import { AnyAction } from "redux";

export default (
  state = {
    soundList: [], // Shorter sound bites
    sounds: {}, // Shorter sound bites
  },
  action: AnyAction
) => {
  switch (action.type) {
    case "INITIALIZE_WITH_TOKENIZED_AND_DATA":
      if (action.currentDocumentData?.short_audio) {
        return action.currentDocumentData.short_audio;
      }
      return state;
    case "UPDATE_DEFINITION":
      return {
        ...state,
        areSoundsUpdated: false,
      };
    case "SOUND_BITE_LIST":
      return {
        ...state,
        areSoundsUpdated: true,
        soundList: action.soundList,
        wordID_to_text: action.wordID_to_text,
      };
    case "SOUND_BITE_IS_UPDATED":
      return {
        ...state,
        areSoundsUpdated: true,
      };
    case "SOUND":
      return {
        ...state,
        sounds: {
          ...state.sounds,
          ...action.sound,
        },
      };
    case "SOUND_BITE_FILE": // Recorder
      return {
        ...state,
        sounds: {
          ...state.sounds,
          [action.word]: [
            action.filename,
            ...(state.sounds[action.word] || []),
          ],
        },
      };
    default:
      return state;
  }
};
