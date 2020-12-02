let timer;
let average_word_length = 6;
import store from 'App/store'
let MINOR_BREAK = /[,;:]$/

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
  } else {
    store.dispatch({
      type: 'SPEED_READER_UPDATE',
      running: true,
      started: true,
      mouse_hidden: true,
    })
    // cur = last_cur /* Go one back to start on the same word */
    timeoutAndNext(0, 150)
  }
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

export const startStop = () => {
  const { running } = store.getState().speed_reader
  if (running) {
    stop()
  } else {
    start()
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


export const close = () => {
  store.dispatch({
    type: 'SPEED_READER_UPDATE',
    open: false,
    running: false,
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
  if (!running) {
    return;
  }
  const word = words[cur].text || ''
  const minMultiplier = 0.65

  let showTranslation = false
  let multiplier;
  if (words[cur].length) {
    multiplier = words[cur].length
  } else {
    minMultiplier + (1 - minMultiplier) * (word.length / average_word_length)
    if (multiplier > 1) {
      multiplier = multiplier ** 1.4
    }
    multiplier = clamp(multiplier, minMultiplier, 1.8)
    if (MINOR_BREAK.test(word)) {
      multiplier = 1.4
    }
    if (words[cur].difficult) {
      multiplier = 4.2
      showTranslation = true
    }
  }


  store.dispatch({
    type: 'SPEED_READER_UPDATE',
    cur: cur + 1,
    showTranslation,
  })
  timeoutAndNext(multiplier, add)
}

const clamp = function(input, min, max) {
  return Math.min(Math.max(input, min), max);
}
