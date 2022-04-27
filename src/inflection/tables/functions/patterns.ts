import { getOrderedGrammaticalCategories } from "inflection/tables/classification/classification";
import Word from "inflection/tables/word";
import { without } from "lodash";

const splittableRegexEndingsFromArray = (input: string[]) => {
  return new RegExp(
    `(${input.sort((a, b) => b.length - a.length).join("|")})$`
  );
};

/**
 * Removes inflectional pattern and returns the rest
 */
export const removeInflectionalPattern = (
  input: string,
  word: Word
): string => {
  // if (!input) return;
  let stripped = input;

  if (
    word.isAny(
      "adjective",
      "past participle"
    ) /*|| word.is('with definite article')*/
  ) {
    stripped = input.replace(adjectiveEndings, "");
  } else if (word.is("verb")) {
    stripped = input.replace(verbEndings, "");
  } else if (word.is("noun")) {
    let possibleEndingsForGender =
      nounEndings[
        word.getType("gender")
      ]; /*[word.getType('plurality')][word.getType('article')]*/
    const siblingClassification = without(
      word.getClassificationOfFirstRow(),
      ...getOrderedGrammaticalCategories("cases")
    );
    const siblings = word
      .getOriginal()
      .get(...siblingClassification)
      .get(1);
    const wordCaseIndex = getOrderedGrammaticalCategories("cases").indexOf(
      word.getType("case")
    );
    let ending = "";
    /* Find exact pattern matches for primary variants */
    if (word.is(1)) {
      const result = possibleEndingsForGender.find((pattern) => {
        return pattern.every((ending, index) => {
          const _case = getOrderedGrammaticalCategories("cases")[index];
          const value = siblings.get(_case).getFirstValue();
          if (value) {
            return new RegExp(`${ending}$`).test(value);
          } else {
            if (process.env.NODE_ENV === "development") {
              throw new Error(`Sure that there is no ${_case} for ${input}?`);
            }
            return true;
          }
        });
      });
      if (result) {
        ending = result[wordCaseIndex];
        // console.log('Found ending for ' + input)
        // console.log(result)
      } else {
        if (process.env.NODE_ENV === "development") {
          throw new Error("!!!!!!! Did not find ending for " + input);
        }
      }
    } else {
      /* Secondary variants get just a quick check */
      const result = possibleEndingsForGender
        .map((pattern) => pattern[wordCaseIndex])
        .sort((a, b) => b.length - a.length)
        .find((ending) => {
          return new RegExp(`${ending}$`).test(input);
        });
      if (result) {
        ending = result;
      } else {
        // throw new Error('!!!!!!! Did not find ending for ' + input)
      }
    }
    stripped = input.replace(new RegExp(`(${ending})$`), "");
  }
  return stripped;
};

/*
  Helper function for above noun arrays
*/
const sortByLongestSubArray = (arrays: Array<Array<string>>) => {
  return arrays.sort((a, b) => b.join("").length - a.join("").length);
};
const nounEndings: Record<string, Array<Array<string>>> = {
  masculine: sortByLongestSubArray([
    // EINTALA
    // "bróðir"
    ["(ir)", "(ur)", "(ur)", "(ur)"],
    ["(ir)inn", "(ur)inn", "(ur)num", "(ur)ins"],
    // "plástur"
    ["(ur)", "(ur)", "(r)i", "(ur)s"],
    ["(ur)inn", "(ur)inn", "(ur)inum", "(ur)sins"],
    // "bátur"
    ["ur", "", "i", "s"],
    ["urinn", "inn", "num", "sins"],
    // "gangur"
    ["urinn", "inn", "inum", "sins"],
    // "hamar"
    ["inn", "inn", "inum", "sins"],
    // "hringur"
    ["ur", "", "", "s"],
    // "Egill"
    ["", "", "i", "s"],
    // "sjár"
    ["r", "", "", "var"],
    ["rinn", "inn", "num", "varins"],
    // "vinur"
    ["ur", "", "i", "ar"],
    ["urinn", "inn", "inum", "arins"],
    // "lækur"
    ["ur", "", "", "jar"],
    ["urinn", "inn", "num", "jarins"],
    // "matur"
    ["ur", "", "", "ar"],
    ["urinn", "inn", "num", "arins"],
    // "skjár"
    ["r", "", "", "s"],
    ["rinn", "inn", "num", "sins"],
    // "pabbi"
    ["i", "a", "a", "a"],
    ["inn", "ann", "anum", "ans"],
    // "ofn"
    ["", "", "i", "s"],
    ["inn", "inn", "inum", "sins"],
    // "bíll"
    ["", "", "", "s"],
    ["inn", "inn", "num", "sins"],
    // "morgunn"
    ["unn", "un", "ni", "uns"],
    ["unninn", "uninn", "ninum", "unsins"],
    // "bær"
    ["r", "", "", "jar"],
    ["rinn", "inn", "num", "jarins"],
    // FLEIRTALA
    // bátar" / "strákar"
    ["ar", "a", "um", "a"],
    ["arnir", "ana", "unum", "anna"],
    // "feður"
    ["ur", "ur", "rum", "ra"],
    ["urnir", "urna", "runum", "ranna"],
    // "hringur"
    ["ir", "i", "jum", "ja"],
    ["irnir", "ina", "junum", "janna"],
    // "vinir"
    ["ir", "i", "um", "a"],
    ["irnir", "ina", "unum", "anna"],
    // "morgunn"
    ["nar", "na", "num", "na"],
    ["narnir", "nana", "nunum", "nanna"],
    // "bændur"
    ["ur", "ur", "um", "a"],
    ["urnir", "urna", "unum", "anna"],
    // "menn"
    ["", "", "um", "a"],
    // "bæir"
    ["ir", "i", "jum", "ja"],
    ["irnir", "ina", "junum", "janna"],
  ]),
  // Kvenkyn
  feminine: sortByLongestSubArray([
    // EINTALA
    // systir
    ["ir", "ur", "ur", "ur"],
    ["irin", "urina", "urinni", "urinnar"],
    // "búð"
    ["", "", "", "ar"],
    ["in", "ina", "inni", "arinnar"],
    //  "kona"
    ["a", "u", "u", "u"],
    ["an", "una", "unni", "unnar"],
    // "elding"
    ["", "u", "u", "ar"],
    ["in", "una", "unni", "arinnar"],
    // "mjólk"
    ["", "", "", "ur"],
    ["in", "ina", "inni", "urinnar"],
    // "keppni"
    ["i", "i", "i", "i"],
    ["in", "ina", "inni", "innar"],
    // "á"
    ["", "", "", "r"],
    ["in", "na", "nni", "rinnar"],
    // FLEIRTALA
    // "systur"
    ["ur", "ur", "rum", "ra"],
    ["urnar", "urnar", "runum", "ranna"],
    // "stúlkur"
    ["ur", "ur", "um", "na"],
    ["urnar", "urnar", "unum", "nanna"],
    // "keppnir"
    ["nir", "nir", "num", "na"],
    ["nirnar", "nirnar", "nunum", "nanna"],
    // "búðir"
    ["ir", "ir", "um", "a"],
    ["irnar", "irnar", "unum", "anna"],
    // "persónur"
    ["ur", "ur", "um", "a"],
    ["urnar", "urnar", "unum", "anna"],
    // "vélar"
    ["ar", "ar", "um", "a"],
    ["arnar", "arnar", "unum", "anna"],
    // "bækur"
    ["ur", "ur", "um", "a"],
    ["urnar", "urnar", "unum", "anna"],
    // "dyr"
    ["", "", "um", "a"],
    ["nar", "nar", "unum", "anna"],
    // "ár"
    ["", "", "m", "a"],
    ["nar", "nar", "num", "nna"],
  ]),
  // Hvorugkyn
  neuter: sortByLongestSubArray([
    // EINTALA
    // "ríki"
    ["i", "i", "i", "s"],
    // "jójó"
    ["", "", "", "s"],
    // "barn"
    ["", "", "i", "s"],
    ["ið", "ið", "inu", "sins"],
    // "hjarta"
    ["a", "a", "a", "a"],
    ["að", "að", "anu", "ans"],
    // FLEIRTALA
    // "augu"
    ["u", "u", "um", "na"],
    ["un", "un", "unum", "nanna"],
    // "epli"
    ["i", "i", "um", "a"],
    ["in", "in", "unum", "anna"],
    // "börn"
    ["", "", "um", "a"],
    ["in", "in", "unum", "anna"],
    // "hjörtu"
    ["u", "u", "um", "a"],
    ["un", "un", "unum", "anna"],
  ]),

  // masculine: {
  //   singular: {
  //     'with definite article': sortLongest([
  //       // "bróðir"
  //       ['(ir)', '(ur)', '(ur)', '(ur)'],
  //     ]),
  //     'without definite article': sortLongest([]),
  //   },
  //   plural: {
  //     'with definite article': sortLongest([]),
  //     'without definite article': sortLongest([]),
  //   },
  // },
  // feminine: {
  //   singular: {
  //     'with definite article': sortLongest([]),
  //     'without definite article': sortLongest([]),
  //   },
  //   plural: {
  //     'with definite article': sortLongest([]),
  //     'without definite article': sortLongest([]),
  //   },
  // },
  // neuter: {
  //   singular: {
  //     'with definite article': sortLongest([]),
  //     'without definite article': sortLongest([]),
  //   },
  //   plural: {
  //     'with definite article': sortLongest([]),
  //     'without definite article': sortLongest([]),
  //   },
  // },
};

// const nounEndings = splittableRegexEndingsFromArray([
//   "ri",
//   "rið",
//   "rinu",
//   "rinum",
//   "rum",
// ]);

const adjectiveEndings = splittableRegexEndingsFromArray([
  "an",
  "anna",
  "ið",
  "in",
  "inn",
  "inna",
  "innar",
  "inni",
  "ins",
  "inu",
  "inum",
  "na",
  "nar",
  "ni",
  "nir",
  "nu",
  "num",
  "una",
  "unnar",
  "unni",
  "unum",
]);

const verbEndings = splittableRegexEndingsFromArray([
  "ðu",
  "ið",
  "iði",
  "ir",
  "ist",
  "ju",
  "juð",
  "jum",
  "jumst",
  "just",
  "st",
  "uði",
  "um",
  "umst",
  "uð",
  "u",
  "i",
  "irðu",
  "juði",
  "usti",
  "justi",
  "istu",
  "andi",
  // Mediopassive
  "isti",
  "usti",
]);
