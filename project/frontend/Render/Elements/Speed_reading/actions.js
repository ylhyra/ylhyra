let timer;
let average_word_length = 6;
import store from 'App/store'

const reset = () => {
  store.dispatch({
    type: 'SPEED_READER_UPDATE',
    prop: 'cur',
    value: 0,
  })
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
  timeoutAndNext(0, 150)
}

const stop = () => {
  // running = false
  timer && clearTimeout(timer)

  store.dispatch({
    type: 'SPEED_READER_UPDATE',
    running: false,
    mouse_hidden: false,
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
  const { words, cur } = store.getState().speed_reader
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


export const checkKey = (e) => {
  console.log((e.keyCode))
  const { running } = store.getState().speed_reader
  /* Space */
  if (e.keyCode === 32) {
    e.preventDefault()
    if (running) {
      stop()
    } else {
      start()
    }
  }
  /* Escape */
  else if (e.keyCode === 27) {
    //
  }
  // /* Left */
  // else if (e.keyCode === 37) {
  //   goToLastSentence()
  // }
  // /* Right */
  // else if (e.keyCode === 39) {
  //   for (let i = cur + 1; i < words.length; i++) {
  //     if (words[i] === PARAGRAPH_BREAK || words[i] === SENTENCE_BREAK) {
  //       cur = i + 1;
  //       next(200)
  //       break;
  //     }
  //   }
  // }
  // /* Up */
  // else if (e.keyCode === 38 && wpm < 1000) {
  //   wpm += 25
  //   render()
  //   // wpm = wpm * 1.03 + 5
  //   // wpm = Math.round(wpm / 5) * 5
  // }
  // /* Down */
  // else if (e.keyCode === 40 && wpm > 25) {
  //   wpm -= 25
  //   render()
  //   // wpm = wpm / 1.03 - 5
  //   // wpm = Math.round(wpm / 5) * 5
  // }
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
    }, 700)
  }
}


export const prev = () => {
  const { words, cur } = store.getState().speed_reader
  for (let i = Math.max(0, cur - 1); i >= 0; i--) {
    if (words[i].text || i === 0) {
      store.dispatch({
        type: 'SPEED_READER_UPDATE',
        cur: i,
      })
      break;
    }
  }
}
