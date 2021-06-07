/**
 * Principal parts (kennimyndir)
 * @memberof Word
 * @return {?boolean}
 */
export function getPrincipalParts() {
  if (this.is('verb')) {
    /* TODO: Support generation for miðmynd */
    const word = this.getOriginal()
    // .without(
    //   'impersonal with accusative subject',
    //   'impersonal with dative subject',
    //   'impersonal with genitive subject',
    //   'impersonal with dummy subject'
    // ).get('active voice')

    let principalParts = [
      word.get('infinitive'),
      word.get( /*'indicative', */ 'past tense', '1st person', 'singular'),
      word.isStrong() && word.get( /*'indicative',*/ 'past tense', '1st person', 'plural'),
      word.get('supine'),
    ]
    // console.log(this.getFirst().render())
    // console.log(this.get('past tense').rows.length/*.getFirst()/*.render()*/)
    return principalParts.filter(Boolean).map(i => i.getFirstAndItsVariants().render()).join(', ')
  }
  return ''
}
