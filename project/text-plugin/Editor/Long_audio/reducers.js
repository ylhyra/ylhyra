import string_hash from 'App/functions/hash'
const defaultState = {
  filename: null,
  xml_hash: null,
  xml: null,
  sync: null,
}
/*
  Long audio
*/
export default (state = defaultState, action) => {
  switch (action.type) {
    case 'LOAD_EDITOR':
      return {
        ...state,
        ...(action.content.long_audio || {}),
      }
    case 'AUDIO_AREA':
      const xml_hash = hash(action.content)
      if (!action.content) return defaultState;
      if (xml_hash === state.xml_hash && action.filename === state.filename) {
        return state;
      } else {
        return {
          filename: action.filename,
          xml_hash: xml_hash,
          xml: action.content,
          sync: null,
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
