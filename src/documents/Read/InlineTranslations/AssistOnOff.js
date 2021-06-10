import { fix_inline_translations } from 'documents/Read/InlineTranslations/InlineTranslations/'

/*
  We use a false checkbox since iOS doesn't behave well with inputs.
*/
window.assistOnOff = (element) => {
  /*
    Assist ON
  */
  if (!element.hasAttribute('data-checked')) {
    element.setAttribute('data-checked', true)
    element.closest('.container').removeAttribute('no-assist')
    element.closest('.container').setAttribute('assist', 'true')
    fix_inline_translations()
  }
  /*
    Assist OFF
  */
  else {
    element.removeAttribute('data-checked')
    element.closest('.container').removeAttribute('assist')
    element.closest('.container').setAttribute('no-assist', 'true')
    const elements = document.querySelectorAll(`.inline_translation`)
    elements.forEach(e => {
      const wordContainer = e.closest(`.word-container`)
      wordContainer.style.minWidth = 'auto'
    })
  }
}
