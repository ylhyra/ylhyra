import link from 'tables/link'

/**
 * @memberof Word
 * @return {?string}
 */
export function getWordDescription() {
  let output = []

  output.push(this.getDomain())

  output.push(
    /* Gender for nouns */
    (this.is('noun') ? (link(this.getType('gender')) + ' ') : '') +
    /* Word class */ 
    link(this.getType('class'))
  )

  const isStrong = this.isStrong()
  if (isStrong === true) {
    output.push(link('strongly conjugated'))
  } else if (isStrong === false) {
    output.push(link('weakly conjugated'))
  }

  if (this.getIsWordIrregular()) {
    output.push(link('irregular inflection'))
  }
  if (this.getWordHasUmlaut()) {
    output.push(link('includes a sound change'))
  }
  if (!this.is('indeclinable') && this.getIsWordIrregular() === false && this.getWordHasUmlaut() === false) {
    output.push(link('regular inflection'))
  }

  output = output.filter(Boolean).join(', ')

  return output
}
