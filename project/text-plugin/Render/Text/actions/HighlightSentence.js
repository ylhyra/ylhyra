import { logShown } from './Reset'

/*
  Hightlight sentence
*/
export const highlightSentence = (id) => {
  const element = $(`[data-sentence-id="${id}"]`)
  element.addClass('highlighted')
  logShown(element)
}


const addClass = (selector, css) => {
  const element = document.querySelector(selector)
  if (!element) return;
  element.classList.add(css)
}
