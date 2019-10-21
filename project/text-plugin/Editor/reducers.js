import { combineReducers } from 'redux'
import { translation, selected } from 'Editor/Translator/reducers'
import suggestions from 'Editor/Suggestions/reducers'
import MakeList from 'Parse/Tokenize/List'
import short_audio from 'Editor/Short_audio/reducers'
import getParameter from 'get-parameter'

const isOpen = typeof window !== 'undefined' ? getParameter('editor') : false
const open = (state = isOpen, action) => {
  switch (action.type) {
    case 'OPEN_EDITOR':
      return action.page
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
  short_audio,
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
