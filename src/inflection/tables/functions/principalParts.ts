import { Html } from "inflection/tables/types";
import Word from "inflection/tables/word";
import { filterEmpty } from "modules/typescript/filterEmpty";

/**
 * Principal parts (kennimyndir)
 * Currently only used for verbs.
 */
export function getPrincipalParts(this: Word): Html {
  if (this.is("verb")) {
    /* TODO: Support generation for miðmynd */
    const word = this.getOriginal();
    // .without(
    //   'impersonal with accusative subject',
    //   'impersonal with dative subject',
    //   'impersonal with genitive subject',
    //   'impersonal with dummy subject'
    // ).get('active voice')

    let principalParts = [
      word.get("infinitive"),
      word.get(/*'indicative', */ "past tense", "1st person", "singular"),
      word.isStrong()
        ? word.get(/*'indicative',*/ "past tense", "1st person", "plural")
        : null,
      word.get("supine"),
    ];

    return principalParts
      .filter(filterEmpty)
      .map((i: Word) => {
        /** Done to allow supine to get matching helper words */
        if (i.is("supine") && principalParts[1]) {
          return i
            .getFirstAndItsVariants()
            .renderWithHelperWords(principalParts[1].getFirst());
        }
        return i.getFirstAndItsVariants().renderWithHelperWords();
      })
      .join(", ");
  }
  return "";
}
