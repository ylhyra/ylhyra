import { getScrollingElement } from 'helpers.js'
import { ReadAlongSingleSentence } from 'Audio/ReadAlong'
import { logShown } from './Reset'

/*
  Show sentence
*/

export const showSentence = (id) => {
  document.body.classList && document.body.classList.add('sentence-shown')
  const relative = document.querySelector('.ylhyra-text').getBoundingClientRect()
  ReadAlongSingleSentence(id)

  /*
    SENTENCE
  */
  const sentence = document.querySelector(`[data-sentence-id="${id}"]`)
  if (!sentence) return;
  sentence.classList.add('shown')
  logShown(sentence)
  const sentenceRect = sentence.getBoundingClientRect()

  /*
    SENTENCE OVERLAY
  */
  const sentenceOverlay = document.querySelector(`[data-sentence-overlay-id="${id}"]`)
  sentenceOverlay.classList.add('shown')
  logShown(`[data-sentence-overlay-id="${id}"]`)
  const paddingTop = 8
  const paddingLeft = 12
  let sentenceOverlayDimensions = {
    top: sentenceRect.top - relative.top - paddingTop,
    height: sentenceRect.height + paddingTop * 2,
    left: sentenceRect.left - relative.left - paddingLeft,
    width: sentenceRect.width + paddingLeft * 2,
  }

  /*
    BOX
  */
  const box = document.querySelector(`[data-box-id="${id}"]`)
  box.classList.add('shown')
  logShown(`[data-box-id="${id}"]`)
  box.style.cssText = `
    left: ${sentenceOverlayDimensions.left}px;
    width: ${sentenceOverlayDimensions.width}px;
  `
  let boxRect = box.getBoundingClientRect()
  box.style.cssText += `
    top: ${sentenceOverlayDimensions.top - boxRect.height}px;
    height: ${boxRect.height}px;
  `

  /*
    Do we need to scroll to element?
  */
  boxRect = box.getBoundingClientRect() // Recalculate after style change
  if (boxRect.y < 0) {
    getScrollingElement().scrollBy({
      top: boxRect.y,
      behavior: 'smooth'
    })
  }

  sentenceOverlay.style.cssText = `
    top: ${sentenceOverlayDimensions.top}px;
    height: ${sentenceOverlayDimensions.height}px;
    left: ${sentenceOverlayDimensions.left}px;
    width: ${sentenceOverlayDimensions.width}px;
  `
}



const addClass = (selector, css) => {
  const element = document.querySelector(selector)
  if (!element) return;
  element.classList.add(css)
}
