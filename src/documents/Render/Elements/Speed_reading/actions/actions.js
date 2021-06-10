import store from 'app/App/store'
let timer;
let average_word_length = 6;
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
  if(words.length < 1) return;
  if (cur + 1 >= words.length) {
    reset()
  } else {
    store.dispatch({
      type: 'SPEED_READER_UPDATE',
      running: true,
      started: true,
      mouse_hidden: true,
      done: false,
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

const done = () => {
  timer && clearTimeout(timer)
  store.dispatch({
    type: 'SPEED_READER_UPDATE',
    running: false,
    mouse_hidden: false,
    done: true,
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


export const open = ()=>{
  $('#container, header').hide()
  store.dispatch({
    type: 'SPEED_READER_UPDATE',
    open: true,
  })
  store.dispatch({
    type: 'CURRENTLY_PLAYING',
    currentlyPlaying: null
  })
}
export const close = () => {
  $('#container, header').show()

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
  let next_index = cur + 1
  if (!document.hasFocus()) {
    return stop()
  }
  if (next_index >= words.length) {
    return done()
  }
  if (!running) {
    return;
  }
  const word = words[next_index].text || ''
  const minMultiplier = 0.65
  let showTranslation = false
  let multiplier;
  if (words[next_index].length) {
    multiplier = words[next_index].length
  } else {
    const ratio = (word.length / average_word_length)
    if (ratio > 1) {
      multiplier = 1 + (ratio - 1) ** 1.7
    } else {
      multiplier = minMultiplier + (1 - minMultiplier) * ratio
    }
    multiplier = clamp(multiplier, minMultiplier, 1.8)
    if (MINOR_BREAK.test(word)) {
      multiplier = Math.max(1.3, multiplier)
    }
    if (words[next_index].difficult) {
      multiplier = Math.max(1.6, multiplier)
      showTranslation = true
    }
  }

  store.dispatch({
    type: 'SPEED_READER_UPDATE',
    cur: next_index,
    showTranslation,
  })
  timeoutAndNext(multiplier, add)
}

const clamp = function(input, min, max) {
  return Math.min(Math.max(input, min), max);
}
