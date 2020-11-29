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

const clamp = function (input, min, max) {
  return Math.min(Math.max(input, min), max);
}
