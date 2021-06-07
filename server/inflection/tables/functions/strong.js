import { endsInConsonant } from 'tables/functions/vowels'

/**
 * Strong or weak inflection
 * TODO: Pronouns
 *
 * @memberof Word
 * @return {?boolean}
 */
export function isStrong() {
  let results
  if ('isStrong_saved' in this) {
    return this.isStrong_saved
  }

  /* Noun */
  if (this.is('noun')) {
    const table_to_check = this.getOriginal().get('singular', 'without definite article', 1).getForms()
    if (table_to_check.length === 0) return;
    results = table_to_check.some(endsInConsonant)
  }
  /* Verb */
  else if (this.is('verb')) {
    // const word = this.getOriginal().without(
    //   'impersonal with accusative subject',
    //   'impersonal with dative subject',
    //   'impersonal with genitive subject',
    //   'impersonal with dummy subject'
    // ).get('active voice')

    const past_tense = this.get( /*'indicative', */ 'past tense', /*'1st person', 'singular'*/ ).getFirstValue()
    /* Does not end in "-i" */
    results = !/i$/.test(past_tense)
  }

  this.isStrong_saved = results
  return results
}

/**
 * Opposite of the above
 *
 * @memberof Word
 * @return {?boolean}
 */
export function isWeak() {
  const strong = this.isStrong()
  if (strong !== undefined) {
    return !strong
  }
}
