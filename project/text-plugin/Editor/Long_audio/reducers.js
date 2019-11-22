/*
  Long audio
*/
export default (state = {
  ids: [],
  sync: {},
}, action) => {
  switch (action.type) {
    case 'LOAD_EDITOR':
      return {
        ...state,
        ...(action.content.long_audio || {}),
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
