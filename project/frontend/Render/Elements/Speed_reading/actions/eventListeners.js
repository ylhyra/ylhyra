import store from 'App/store'
import { startStop, prevWord, nextWord } from './start'
export const checkKey = (e) => {
  // console.log((e.keyCode))
  /* Space */
  if (e.keyCode === 32) {
    e.preventDefault()
    startStop()
  }
  /* Escape */
  else if (e.keyCode === 27) {
    //
  }
  /* Left */
  else if (e.keyCode === 37) {
    prevWord()
  }
  /* Right */
  else if (e.keyCode === 39) {
    nextWord()
  }
  /* Up */
  else if (e.keyCode === 38 && store.getState().wpm < 1000) {
    store.dispatch({
      type: 'SPEED_READER_UPDATE',
      wpm: store.getState().wpm + 25,
    })
  }
  /* Down */
  else if (e.keyCode === 40 && store.getState().wpm > 25) {
    store.dispatch({
      type: 'SPEED_READER_UPDATE',
      wpm: store.getState().wpm - 25,
    })
  }
}



let mouseTimer;
export const mouseListener = () => {
  const { running, mouse_hidden } = store.getState().speed_reader
  if (running) {
    mouseTimer && clearTimeout(mouseTimer)
    mouse_hidden && store.dispatch({
      type: 'SPEED_READER_UPDATE',
      mouse_hidden: false,
    })
    mouseTimer = setTimeout(() => {
      store.dispatch({
        type: 'SPEED_READER_UPDATE',
        mouse_hidden: true,
      })
    }, 2000)
  }
}
