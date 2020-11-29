let timer;
let cur = 0;
let last_cur = 0;
let average_word_length = 6;
import store from 'App/store'

const reset = () => {
  cur = 0
  last_cur = cur
}

export const start = () => {
  const { words, cur } = store.getState().speed_reader
  if (cur >= words.length) {
    reset()
  }
  // cur = last_cur /* Go one back to start on the same word */
  next(150)
}

const stop = () => {
  // running = false
  timer && clearTimeout(timer)
  document.body.removeAttribute('data-running')
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
  const word = words[cur]
  const minMultiplier = 0.65
  let multiplier = minMultiplier + (1 - minMultiplier) * (word.length / average_word_length)
  if (multiplier > 1) {
    multiplier = multiplier ** 1.4
  }
  multiplier = clamp(multiplier, minMultiplier, 1.8)
  last_cur = cur
  // cur = cur + word.split(' ').length
  // if (word === PARAGRAPH_BREAK) {
  //   word = ''
  //   multiplier = 2
  // } else if (word === SENTENCE_BREAK) {
  //   word = ''
  //   multiplier = 1
  // }
  // // else if (MAJOR_BREAK.test(word) && words[cur + 1] !== PARAGRAPH_BREAK) {
  // //   multiplier = 2
  // // }
  // else if (MINOR_BREAK.test(word)) {
  //   multiplier = 1.4
  // }
  //
  //
  // output.innerHTML = `<span id="word" style="opacity:0">${word}</span>`
  // const outputWidth = output.getBoundingClientRect().width
  // const w = document.getElementById('word')
  // const wordWidth = w.getBoundingClientRect().width
  // let leftpad = (outputWidth - wordWidth * 0.6) / 2 - 10
  // if (wordWidth >= leftpad / 2) {
  //   leftpad = Math.min(leftpad, (outputWidth - wordWidth))
  // }
  // w.setAttribute('style', `display:block;width:${Math.ceil(wordWidth)}px;margin-left:${Math.floor(Math.max(0,leftpad))}px`)
  //
  // timeoutAndNext(multiplier, add)
  //
  //
  store.dispatch({
    type: 'SPEED_READER_UPDATE',
    prop: 'cur',
    value: cur + 1,
  })
}

const clamp = function (input, min, max) {
  return Math.min(Math.max(input, min), max);
};
