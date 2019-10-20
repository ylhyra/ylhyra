export default (state = {
  soundList: [], // Shorter sound bites
  sounds: {}, // Shorter sound bites
}, action) => {
  switch (action.type) {
    case 'LOAD_EDITOR':
      return {
        ...state,
        ...(action.content.audio || {}),
      }
    case 'UPDATE_INPUT':
      return {
        ...state,
        areSectionsUpdated: false,
        areSoundsUpdated: false,
      }
    case 'UPDATE_DEFINITION':
      return {
        ...state,
        areSoundsUpdated: false,
      }
    case 'AUDIO_SECTIONS':
      return {
        ...state,
        sections: action.content,
        areSectionsUpdated: true,
      }
    case 'AUDIO_FILE':
      return {
        ...state,
        files: {
          ...state.files,
          [action.content.sectionHash]: action.content,
        },
        sync: {
          ...state.sync,
          [action.content.sectionHash]: null,
        }
      }
    case 'DELETE_AUDIO_FILE':
      return {
        ...state,
        files: {
          ...state.files,
          [action.content.sectionHash]: null,
        },
        sync: {
          ...state.sync,
          [action.content.sectionHash]: null,
        }
      }
    case 'SYNC':
      return {
        ...state,
        sync: {
          ...state.sync,
          [action.content.sectionHash]: action.content,
        }
      }
    case 'PRONUNCIATION_AND_SOUND':
      return {
        ...state,
        ...action.sound,
      }
    case 'SOUND_BITE_LIST':
      return {
        ...state,
        areSoundsUpdated: true,
        soundList: action.soundList,
        wordID_to_text: action.wordID_to_text,
      }
    case 'SOUND_BITE_IS_UPDATED':
      return {
        ...state,
        areSoundsUpdated: true,
      }
    case 'SOUND_BITE_FILES':
      return {
        ...state,
        sounds: {
          ...state.sounds,
          ...action.content.sound,
        },
      }
    case 'SOUND_BITE_FILE':
      return {
        ...state,
        sounds: {
          ...state.sounds,
          [action.word]: [
            action.filename,
            ...state.sounds[action.word],
          ]
        },
      }
    default:
      return state
  }
}
