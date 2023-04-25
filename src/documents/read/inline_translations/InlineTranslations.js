export const fix_inline_translations = () => {
  // // Temporary turn off. Is a bit ugly.
  // return;

  const elements = document.querySelectorAll(`.inline_translation`)
  elements.forEach(e => {

    /*
      Calculate the width of this inline translation
    */
    const width = Math.round(e.getBoundingClientRect().width)

    /*
      Make word equal width
    */
    const wordContainer = e.closest(`.word-container`)
    wordContainer.style.minWidth = (width - 2) + 'px'

    /*
      Fix position
    */
    const computedStyle = window.getComputedStyle(wordContainer, null)
    const fontSize = parseInt(computedStyle.fontSize.replace('px', ''))
    const lineHeight = parseInt(computedStyle.lineHeight.replace('px', ''))

    e.style.bottom = 1 + fontSize + (lineHeight - fontSize) / 2 + 'px'
  })
};
