import { combineReducers } from 'redux'
import { translation, selected } from 'Editor/Translator/reducers'
import suggestions from 'Editor/Translator/Suggestions/reducers'
import MakeList from 'Parse/Tokenize/List'

const isOpen = window.location.hash.substr(1) === 'editor'
const open = (state = isOpen, action) => {
  switch (action.type) {
    case 'OPEN_EDITOR':
      return true
    case 'CLOSE_EDITOR':
      return false
    default:
      return state
  }
}

const tokenized = (state = [], action) => {
  switch (action.type) {
    case 'TOKENIZED':
      return action.currentDocument || state
    default:
      return state
  }
}

const list = (state = {}, action) => {
  switch (action.type) {
    case 'TOKENIZED':
      return MakeList(action.currentDocument)
    default:
      return state
  }
}

const isSaved = (state = true, action) => {
  switch (action.type) {
    case 'LOAD_EDITOR':
    case 'SAVED':
      return true
    case 'AUDIO_SECTIONS':
    case 'AUDIO_FILE':
    case 'DELETE_WORD':
    case 'PRONUNCIATION_AND_SOUND':
    case 'SUGGEST':
    case 'SYNC':
    case 'UPDATE_DEFINITION_VALUE':
    case 'UPDATE_DEFINITION':
    case 'UPDATE_INPUT':
    case 'UPDATE_METADATA_SINGLE':
    case 'UPDATE_PARSED':
    case 'UPDATE_SENTENCE_VALUE':
    case 'SOUND_BITE_FILES':
    case 'SOUND_BITE_FILE':
      return false
    default:
      return state
  }
}

export const editor = combineReducers({
  open,
  isSaved,
  tokenized,
  list, // List of words and sentences
  translation,
  suggestions,
  selected, // Selected words in the Editor
  // audio,
  // pronunciation,
})


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
