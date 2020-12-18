const isBrowser = (typeof window !== 'undefined') && localStorage

export const speed_reader = (state = {
  wpm: (isBrowser && parseInt(localStorage.getItem("wpm"))) || 75,
  skin: (isBrowser && localStorage.getItem("skin")) || 'blackonlight',
  words: [],
  cur: 0,
  started: false,
}, { type, ...props }) => {
  switch (type) {
    case 'SPEED_READER_UPDATE':
      if (props.skin) {
        localStorage.setItem("skin", props.skin)
      }
      if (props.wpm) {
        localStorage.setItem("wpm", props.wpm)
      }
      return {
        ...state,
        ...props,
      }
    default:
      return state
  }
}
