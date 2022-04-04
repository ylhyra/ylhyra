import { Html } from "inflection/tables/types";
import Word from "inflection/tables/word";
import { filterEmpty } from "modules/typescript/filterEmpty";

/**
 * Principal parts (kennimyndir)
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
      word.isStrong() &&
        word.get(/*'indicative',*/ "past tense", "1st person", "plural"),
      word.get("supine"),
    ];
    // console.log(this.getFirst().renderWithHelperWords())
    // console.log(this.get('past tense').rows.length/*.getFirst()/*.renderWithHelperWords()*/)
    return principalParts
      .filter(filterEmpty)
      .map((i) => i.getFirstAndItsVariants().renderWithHelperWords())
      .join(", ");
  }
  return "";
}
