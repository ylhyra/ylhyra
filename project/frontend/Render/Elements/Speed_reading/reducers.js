export const speed_reader = (state = {
  wpm: 75,
  skin: 'blackonlight',
  words: [],
  cur: 0,
  started: false,
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
