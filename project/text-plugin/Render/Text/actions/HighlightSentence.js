
/*
  Hightlight sentence
*/
export const highlightSentence = (id) => {
  addClass(`[data-sentence-id="${id}"]`, 'highlighted')
}


const addClass = (selector, css) => {
  const element = document.querySelector(selector)
  if (!element) return;
  element.classList.add(css)
}
