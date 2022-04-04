import { endsInConsonant } from "inflection/tables/functions/vowels";
import Word from "inflection/tables/word";

/**
 * Strong or weak inflection
 * TODO: Pronouns
 */
export function isStrong(this: Word): Boolean | undefined {
  let results;
  if (typeof this.isStrong_cached !== "undefined") {
    return this.isStrong_cached;
  }

  /* Noun */
  if (this.is("noun")) {
    const tableToCheck = this.getOriginal()
      .get("singular", "without definite article", 1)
      .getForms();
    if (tableToCheck.length === 0) return;
    results = tableToCheck.some(endsInConsonant);
  } else if (this.is("verb")) {
    /* Verb */
    // const word = this.getOriginal().without(
    //   'impersonal with accusative subject',
    //   'impersonal with dative subject',
    //   'impersonal with genitive subject',
    //   'impersonal with dummy subject'
    // ).get('active voice')

    const pastTense = this.get(
      /*'indicative', */ "past tense" /*'1st person', 'singular'*/
    ).getFirstValue();
    if (!pastTense) return;
    /* Does not end in "-i" */
    results = !/i$/.test(pastTense);
  }

  this.isStrong_cached = results;
  return results;
}

/**
 * Opposite of the above
 */
export function isWeak(this: Word): Boolean | undefined {
  const strong = this.isStrong();
  if (strong !== undefined) {
    return !strong;
  }
}
