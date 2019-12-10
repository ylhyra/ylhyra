import string_hash from 'App/functions/hash'

/*
  Long audio
*/
export default (state = {
  filename: null,
  text_hash: null,
  text: null,
  sync: {},
}, action) => {
  switch (action.type) {
    case 'LOAD_EDITOR':
      return {
        ...state,
        ...(action.content.long_audio || {}),
      }
    case 'AUDIO_AREA':
      const text_hash = hash(action.content)
      if (text_hash === state.text_hash && action.filename === state.filename) {
        return state;
      } else {
        return {
          filename: action.filename,
          text_hash: text_hash,
          text: action.content,
          sync: {},
        }
      }
    case 'SYNC':
      return {
        ...state,
        sync: action.content,
      }
    default:
      return state
  }
}

const hash = (input) => {
  return string_hash(input.replace(/^[A-zÀ-ÿ0-9/<>_-]/, ''))
}
