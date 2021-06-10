export const audio = (state = {}, action) => {
  switch (action.type) {
    case 'CURRENTLY_PLAYING':
      return {
        ...state,
        currentlyPlaying: action.content,
      }
    case 'PLAY_SENTENCE':
      return {
        ...state,
        currentlyPlaying: action.filename,
        begin: action.begin,
        end: action.end,
      }
    case 'CLEAR_SENTENCE':
      return {
        ...state,
        begin: null,
        end: null,
      }
    default:
      return state
  }
}
