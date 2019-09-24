/*  __  __
   |  \/  | ___  _   _ ___  ___
   | |\/| |/ _ \| | | / __|/ _ \
   | |  | | (_) | |_| \__ \  __/
   |_|  |_|\___/ \__,_|___/\___| */

import showWord from 'Text/actions/ShowWord'
import reset from 'Text/actions/Reset'
import { highlightSentence } from 'Text/actions/HighlightSentence'
import { showSentence } from 'Text/actions/ShowSentence'

let lastId = null
let isSentenceBeingShown = false

export default function EventListener() {
  document.addEventListener('mousemove', mousemove)
  document.addEventListener('mousedown', mousedown)
}

const mousemove = (e) => {
  if (isSentenceBeingShown) return;
  if (window.listenerCount > 0) {
    let x = e.clientX
    let y = e.clientY
    const target = document.elementFromPoint(x, y)
    const target_10px_below = document.elementFromPoint(x, y - 10)
    if (!target) return
    const ignore = target.closest('[data-ignore]')
    if (ignore) return;

    if (isSentenceBeingShown) {
      const element = target_10px_below?.closest('[data-sentence-id]') || target.closest('[data-sentence-id]')
      if (element && lastId === element.getAttribute('data-sentence-id')) {
        return
      }
    }

    isSentenceBeingShown = false
    const word = target_10px_below?.closest('[data-word-id]') || target.closest('[data-word-id]')
    const sentence = target_10px_below?.closest('[data-sentence-id]') || target.closest('[data-sentence-id]')
    if (!word && !sentence) {
      if (lastId !== null) {
        reset()
        lastId = null
      }
      return
    }
    e.preventDefault()
    if (word) {
      const id = word.getAttribute('data-word-id')
      if (lastId !== id) {
        const sentenceId = sentence ? sentence.getAttribute('data-sentence-id') : null
        reset()
        showWord(id)
        highlightSentence(sentenceId)
      }
      lastId = id
    } else if (sentence) {
      // No translatable word, instead just highlight sentence
      const sentenceId = sentence.getAttribute('data-sentence-id')
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
    const element = target_10px_below?.closest('[data-sentence-id]') || target.closest('[data-sentence-id]')
    if (!element) return
    e.preventDefault()
    isSentenceBeingShown = true
    const id = element.getAttribute('data-sentence-id')
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
