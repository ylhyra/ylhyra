/*  __  __
   |  \/  | ___  _   _ ___  ___
   | |\/| |/ _ \| | | / __|/ _ \
   | |  | | (_) | |_| \__ \  __/
   |_|  |_|\___/ \__,_|___/\___| */

import showWord from 'Text/actions/ShowWord'
import reset from 'Text/actions/Reset'
import { highlightSentence } from 'Text/actions/HighlightSentence'
import { showSentence } from 'Text/actions/ShowSentence'
import { turnOffDemonstration } from 'Render/Frontpage/demo'

let lastId = null
let isSentenceBeingShown = false

export default function EventListener() {
  document.addEventListener('mousemove', mousemove)
  document.addEventListener('mousedown', mousedown)
}

let lastX_seen
let lastY_seen
let lastX_processed
let lastY_processed
let lastTime_seen = 0
let lastTime_processed = 0
let lastTime_quick_movement_seen = 0

const SAMPLE_EVERY_X_MILLISECONDS = 30
const MAX_SPEED = 50 /* Pixels per second */
const TIMOUT_UNTIL_DISAPPEARS = 900
let timer

const mousemove = (e) => {
  if (window.listenerCount > 0) {
    let x = e?.clientX || lastX_seen
    let y = e?.clientY || lastY_seen
    lastX_seen = x
    lastY_seen = y
    let time = new Date().getTime()
    lastTime_seen = time

    /* Limit sampling rate */
    if (lastTime_processed && (time - lastTime_processed) < SAMPLE_EVERY_X_MILLISECONDS) {
      if (!timer) {
        timer = setTimeout(() => {
          mousemove()
        }, SAMPLE_EVERY_X_MILLISECONDS - (time - lastTime_seen))
      }
      return;
    }

    /* Ignore if mouse movement is fast */
    let speed
    if (lastX_processed) {
      let distance = Math.sqrt((x - lastX_processed) ** 2 + (y - lastY_processed) ** 2)
      /* Pixels per second */
      speed = distance / ((time - lastTime_processed) / 1000)
    }
    lastX_processed = x
    lastY_processed = y
    lastTime_processed = time
    if (speed && speed > MAX_SPEED) {
      lastTime_quick_movement_seen = time
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        mousemove()
      }, SAMPLE_EVERY_X_MILLISECONDS)
      return;
    }
    timer = null

    if(!document) return;

    const target = document.elementFromPoint(x, y)
    const target_10px_below = document.elementFromPoint(x, y /*- 10*/)
    if (!target) return
    const ignore = target.closest('[data-ignore]')
    if (ignore) return;

    if (isSentenceBeingShown) {
      const element = target_10px_below?.closest('[data-sentence-has-definition]') || target.closest('[data-sentence-has-definition]')
      if (element && lastId === element.getAttribute('id')) {
        return
      }
    }

    isSentenceBeingShown = false
    const word = target_10px_below?.closest('[data-word-has-definition]') || target.closest('[data-word-has-definition]')
    const sentence = target_10px_below?.closest('[data-sentence-has-definition]') || target.closest('[data-sentence-has-definition]')
    if (!word && !sentence) {

      /* Ignore if user might still be moving in short fits */
      if(time - lastTime_quick_movement_seen < TIMOUT_UNTIL_DISAPPEARS){
        timer && clearTimeout(timer)
        timer = setTimeout(() => {
          mousemove()
        }, time - lastTime_quick_movement_seen)
        return
      }

      if (lastId !== null) {
        reset()
        lastId = null
      }
      return
    }
    // e && e.preventDefault()
    turnOffDemonstration()
    if (word) {
      const id = word.getAttribute('id')
      if (lastId !== id) {
        const sentenceId = sentence ? sentence.getAttribute('id') : null
        reset()
        showWord(id)
        highlightSentence(sentenceId)
      }
      lastId = id
    } else if (sentence) {
      // No translatable word, instead just highlight sentence
      const sentenceId = sentence.getAttribute('id')
      reset()
      highlightSentence(sentenceId)
      lastId = 0
    }
  }
}

const mousedown = (e) => {
  if (window.listenerCount > 0) {
    if (isSentenceBeingShown) {
      isSentenceBeingShown = false
      // mousemove(e)
      reset()
      return
    }
    if (
      e.button === 2 /*Right click*/ ||
      e.button === 16 /*Shift*/ ||
      e.metaKey ||
      e.altKey ||
      e.ctrlKey
    ) {
      lastId = 0
      return
    }
    let x = e.clientX
    let y = e.clientY - 5
    const target = document.elementFromPoint(x, y)
    const target_10px_below = document.elementFromPoint(x, y - 10)
    if (!target) return
    const ignore = target.closest('[data-ignore]')
    if (ignore) return
    const element = target_10px_below?.closest('[data-sentence-has-definition]') || target.closest('[data-sentence-has-definition]')
    if (!element) return
    e.preventDefault()
    isSentenceBeingShown = true
    const id = element.getAttribute('id')
    reset()
    showSentence(id)
    lastId = id
  }
}


/*
  Thought:
  Might be used if "elementFromPoint" doesn't work on old devices.
  https://github.com/moll/js-element-from-point
*/
