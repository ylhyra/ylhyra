import { endsInConsonant } from "inflection/tables/functions/vowels";
import Word from "inflection/tables/word";

/**
 * Strong or weak inflection
 * TODO: Pronouns
 */
export function isStrong(this: Word): boolean | null {
  let results;
  if ("isStrong_cached" in this) {
    return this.isStrong_cached;
  }

  /* Noun */
  if (this.is("noun")) {
    const table_to_check = this.getOriginal()
      .get("singular", "without definite article", 1)
      .getForms();
    if (table_to_check.length === 0) return;
    results = table_to_check.some(endsInConsonant);
  } else if (this.is("verb")) {
    /* Verb */
    // const word = this.getOriginal().without(
    //   'impersonal with accusative subject',
    //   'impersonal with dative subject',
    //   'impersonal with genitive subject',
    //   'impersonal with dummy subject'
    // ).get('active voice')

    const past_tense = this.get(
      /*'indicative', */ "past tense" /*'1st person', 'singular'*/
    ).getFirstValue();
    /* Does not end in "-i" */
    results = !/i$/.test(past_tense);
  }

  this.isStrong_cached = results;
  return results;
}

/**
 * Opposite of the above
 *
 * * @return {?boolean}
 */
export function isWeak(this: Word): boolean | null {
  const strong = this.isStrong();
  if (strong !== undefined) {
    return !strong;
  }
}
