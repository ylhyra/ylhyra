export const speed_reader = (state = {
  wpm: 75,
  skin: 'Black on light',
}, action) => {
  switch (action.type) {
    case 'SPEED_READER_UPDATE':
      return {
        ...state,
        [action.prop]: action.value
      }
    default:
      return state
  }
}
