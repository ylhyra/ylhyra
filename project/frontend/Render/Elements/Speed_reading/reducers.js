const isBrowser = (typeof window !== 'undefined') && (typeof localStorage !== 'undefined') && localStorage

export const speed_reader = (state = {
  wpm: (isBrowser && parseInt(localStorage.getItem("wpm"))) || 75,
  skin: (isBrowser && localStorage.getItem("skin")) || 'blackonlight',
  words: [],
  cur: 0,
  started: false,
  open: false,
}, { type, ...props }) => {
  if (!isBrowser) {
    return state
  }
  switch (type) {
    case 'SPEED_READER_UPDATE':
      if (props.skin) {
        localStorage.setItem("skin", props.skin)
      }
      if (props.wpm) {
        localStorage.setItem("wpm", parseInt(props.wpm))
      }
      return {
        ...state,
        ...props,
      }
    default:
      return state
  }
}
