let timer;
let average_word_length = 6;
import store from 'App/store'

export const reset = () => {
  store.dispatch({
    type: 'SPEED_READER_UPDATE',
    cur: 0,
  })
  start()
}

export const start = () => {
  const { words, cur } = store.getState().speed_reader
  if (cur >= words.length) {
    reset()
  }

  store.dispatch({
    type: 'SPEED_READER_UPDATE',
    running: true,
    started: true,
    mouse_hidden: true,
  })
  // cur = last_cur /* Go one back to start on the same word */
  timeoutAndNext(0, 350)
}

const stop = () => {
  // running = false
  const { words, cur } = store.getState().speed_reader
  timer && clearTimeout(timer)

  store.dispatch({
    type: 'SPEED_READER_UPDATE',
    running: false,
    mouse_hidden: false,
    cur: words[cur].text ? cur : Math.max(0, cur - 1)
  })
}

const timeoutAndNext = (multiplier, add) => {
  const { wpm } = store.getState().speed_reader
  let ms = (multiplier || 1) * (60 * 1 / wpm) * 1000
  ms += add || 0
  timer && clearTimeout(timer)
  timer = setTimeout(() => next(), ms)
}

export const next = (add) => {
  const { words, cur, running } = store.getState().speed_reader
  if (!document.hasFocus() || cur >= words.length) {
    return stop()
  }
  const word = words[cur].text || ''
  const minMultiplier = 0.65
  let multiplier = minMultiplier + (1 - minMultiplier) * (word.length / average_word_length)
  if (multiplier > 1) {
    multiplier = multiplier ** 1.4
  }
  multiplier = clamp(multiplier, minMultiplier, 1.8)
  if (words[cur].length) {
    multiplier = words[cur].length
  }

  store.dispatch({
    type: 'SPEED_READER_UPDATE',
    cur: cur + 1,
  })
  timeoutAndNext(multiplier, add)
}

const clamp = function(input, min, max) {
  return Math.min(Math.max(input, min), max);
}

export const startStop = () => {
  const { running } = store.getState().speed_reader
  if (running) {
    stop()
  } else {
    start()
  }
}

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


export const prevWord = () => {
  const { words, cur } = store.getState().speed_reader
  for (let i = Math.max(0, cur - 1); i >= 0; i--) {
    if (words[i].text || i === 0) {
      store.dispatch({
        type: 'SPEED_READER_UPDATE',
        cur: i,
      })
      stop()
      break;
    }
  }
}
export const nextWord = () => {
  const { words, cur } = store.getState().speed_reader
  for (let i = Math.max(0, cur + 1); i < words.length; i++) {
    if (words[i].text) {
      store.dispatch({
        type: 'SPEED_READER_UPDATE',
        cur: i,
      })
      stop()
      break;
    }
  }
}


const close = () => {

}
