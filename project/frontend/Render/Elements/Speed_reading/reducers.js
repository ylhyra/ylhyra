export const speed_reader = (state = {
  wpm: 75,
  skin: 'Black on light',
  words: [],
  cur: 0,
}, { type, ...props }) => {
  switch (type) {
    case 'SPEED_READER_UPDATE':
      return {
        ...state,
        ...props,
      }
    default:
      return state
  }
}
