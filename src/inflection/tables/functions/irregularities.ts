import { removeInflectionalPattern } from "inflection/tables/functions/patterns";
import {
  getVowelClusters,
  removeVowellikeClusters,
  splitOnVowels,
} from "inflection/tables/functions/vowels";
import Word from "inflection/tables/word";

/**
 *
 */
export function findIrregularities(this: Word) {
  let word = this;
  let wordHasUmlaut: Boolean = false;
  let wordIsIrregular: Boolean = false;
  let wordIsHighlyIrregular: Boolean = false;

  /* Skip highlighting for certain word classes */
  if (
    word.isAny(
      "indeclinable",
      "article",
      "pronoun",
      "personal pronoun",
      "reflexive pronoun",
      "preposition",
      "infinitive particle",
      "interjection",
      "adverb"
    )
  )
    return;

  let stem = word.getStem({
    masculinizeAdjectiveStem: true,
    trimExtra: true,
  });
  if (!stem) {
    // console.log(stem)
    if (process.env.NODE_ENV === "development") {
      throw new Error("Stem not found for " + word.getBaseWord());
    }
    return;
  }

  /* Extreme irregularity (kýr, bróðir) */
  if (isHighlyIrregular(word)) {
    wordIsIrregular = true;
    wordIsHighlyIrregular = true;
  }

  word.rows.forEach((row) => {
    const form = row.inflectional_form;
    const formWithoutEnding = removeInflectionalPattern(
      form,
      new Word([row], word)
    );
    const consonantsInStem = removeVowellikeClusters(stem);
    const consonantsInFormWithoutEnding =
      removeVowellikeClusters(formWithoutEnding);
    let output = form;
    let hasAnElision;

    /*
     * Test umlaut
     */
    if (!form.startsWith(stem)) {
      let letters = splitOnVowels(form);
      const vowelsInStem = getVowelClusters(stem) || [];
      const vowelsInFormWithoutEnding =
        getVowelClusters(formWithoutEnding) || [];
      /* Check two last vowels of stem */
      const vowelIndexesToCheck = [
        vowelsInStem.length - 1,
        vowelsInStem.length - 2,
      ].filter((i) => i >= 0);
      vowelIndexesToCheck.forEach((vowelIndex) => {
        if (vowelsInFormWithoutEnding[vowelIndex]) {
          /* There is an umlaut */
          if (
            vowelsInStem[vowelIndex] !== vowelsInFormWithoutEnding[vowelIndex]
          ) {
            const letterIndex = (vowelIndex + 1) * 2 - 1;
            letters[
              letterIndex
            ] = `<span class="umlaut">${letters[letterIndex]}</span>`;
            wordHasUmlaut = true;
          }
        } else {
          /* Elision of "hamar -> hamri"*/
          // console.log({
          //   form,
          //   vowels_in_stem,
          //   vowels_in_form_without_ending
          // })
          hasAnElision = true;
        }
      });
      output = letters.join("");
    }
    if (hasAnElision) {
      output = `<span class="elision">${output}</span>`;
    }

    /* Test consonant change irregularity */
    if (
      (!ignoreConsonantsThatMayDisappear(
        consonantsInFormWithoutEnding
      ).startsWith(ignoreConsonantsThatMayDisappear(consonantsInStem)) &&
        /* Silly hack for "systir". TODO: Document this */
        !consonantsInStem.startsWith(consonantsInFormWithoutEnding)) ||
      wordIsHighlyIrregular
    ) {
      output = `<em class="irregular">${output}</em>`;
      wordIsIrregular = true;
    }

    row.formattedOutput = output;
  });

  /* Save output into the original Word class */
  word.wordHasUmlaut = wordHasUmlaut;
  word.wordIsIrregular = wordIsIrregular;
}

/**
 * elda -> elti is not irregular.
 * We need some way to ignore the dropped "d".
 *
 * TODO: This is a hack.
 */
const ignoreConsonantsThatMayDisappear = (input: string) => {
  return input.replace(/d/g, "t");
};

// /*
//
// todo: single vowel words
//
// */
// const findLeftoverAfterStem = (form, stem) => {
//   /**
//    * To find the difference from the stem we start by only looking at the consonants of the word
//    */
//   let consonants_in_stem = removeVowellikeClusters(stem)
//   let consonants_in_form = removeVowellikeClusters(form)
//
//   /**
//    * We then remove common inflectional endings if they come *after* the consonants of the stem.
//    * This prevents the "s" from being removed from "til pils"
//    */
//   if (consonants_in_form.startsWith(consonants_in_stem)) {
//     let stem_region_of_form = ''
//     let remaining_after_stem_part = ''
//     let current_consonant_index = 0
//     let done = false
//     splitOnAll(form).forEach(letter => {
//       if (!done) {
//         if (!isVowellikeCluster(letter)) {
//           current_consonant_index++
//           if (current_consonant_index >= consonants_in_stem.length) {
//             done = true
//           }
//         }
//         stem_region_of_form += letter
//       } else {
//         remaining_after_stem_part += letter
//       }
//       // console.log({letter,done,current_consonant_index,remaining_after_stem_part})
//     })
//     console.log({ form, consonants_in_stem, remaining_after_stem_part })
//   } else {
//     /**
//      * TODO:
//      * When inflection is highly irregular, check other siblings to see where vowel change is
//      * Or *dont't* highlight vowel change
//      */
//     if (process.env.NODE_ENV === 'development') {
//       // throw new Error('')
//     }
//   }
// }

export const isHighlyIrregular = (word: Word) => {
  if (word.is("noun")) {
    return isHighlyIrregularNouns.some((i) => i.endsWith(word.getBaseWord()));
  }
};
const isHighlyIrregularNouns = [
  /* Masculine */
  "bróðir",
  "faðir",
  "fingur",
  "fótur",
  "maður",
  "vetur",
  /* Feminine */
  "ær",
  "dóttir",
  "hönd",
  "kýr",
  "lús",
  "mær",
  "móðir",
  "mús",
  "sýr",
  "systir",
];
