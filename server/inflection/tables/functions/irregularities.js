import { removeVowellikeClusters, splitOnVowels, getVowelClusters } from 'tables/functions/vowels'
import { removeInflectionalPattern, isHighlyIrregular } from 'tables/functions/patterns'
import Word from 'tables/word'

/**
 * @memberof Word
 */
export function FindIrregularities() {
  let word = this
  let wordHasUmlaut, wordIsIrregular, wordIsHighlyIrregular

  /* Skip highlighting for certain word classes */
  if (word.isAny(
      'indeclinable',
      'article',
      'pronoun',
      'personal pronoun',
      'reflexive pronoun',
      'preposition',
      'infinitive particle',
      'interjection',
      'adverb',
    )) return;

  let stem = word.getStem({ masculinizeAdjectiveStem: true, trimExtra: true })
  if (!stem) {
    // console.log(stem)
    if (process.env.NODE_ENV === 'development') {
      throw new Error('Stem not found for ' + word.getBaseWord())
    }
    return;
  }

  /* Extreme irregularity (kýr, bróðir) */
  if (isHighlyIrregular(word)) {
    wordIsIrregular = true
    wordIsHighlyIrregular = true
  }

  word.rows.forEach(row => {
    const form = row.inflectional_form
    const form_without_ending = removeInflectionalPattern(form, new Word([row], word))
    const consonants_in_stem = removeVowellikeClusters(stem)
    const consonants_in_form_without_ending = removeVowellikeClusters(form_without_ending)
    let output = form
    let hasAnElision

    /*
     * Test umlaut
     * TODO: Should we ignore umlauts in "maður -> menn"?
     */
    if (!form.startsWith(stem)) {
      let letters = splitOnVowels(form)
      const vowels_in_stem = getVowelClusters(stem) || []
      const vowels_in_form_without_ending = getVowelClusters(form_without_ending) || []
      /* Check two last vowels of stem */
      const vowel_indexes_to_check = [
        vowels_in_stem.length - 1,
        vowels_in_stem.length - 2
      ].filter(i => i >= 0)
      vowel_indexes_to_check.forEach(vowel_index => {
        if (vowels_in_form_without_ending[vowel_index]) {
          /* There is an umlaut */
          if (vowels_in_stem[vowel_index] !== vowels_in_form_without_ending[vowel_index]) {
            const letter_index = (vowel_index + 1) * 2 - 1
            letters[letter_index] = `<span class="umlaut">${letters[letter_index]}</span>`
            wordHasUmlaut = true
          }
        } else {
          /* Elision of "hamar -> hamri"*/
          // console.log({
          //   form,
          //   vowels_in_stem,
          //   vowels_in_form_without_ending
          // })
          hasAnElision = true
        }
      })
      output = letters.join('')
    }
    if (hasAnElision) {
      output = `<span class="elision">${output}</span>`
    }
    /* Test consonant change irregularity */
    if (
      (!consonants_in_form_without_ending.startsWith(consonants_in_stem) &&
        /* Silly hack for "systir" */
        !consonants_in_stem.startsWith(consonants_in_form_without_ending)
      ) ||
      wordIsHighlyIrregular
    ) {
      output = `<em class="irregular">${output}</em>`
      wordIsIrregular = true
    }

    row.formattedOutput = output
  })


  /* Save output into the original Word class */
  word.wordHasUmlaut = wordHasUmlaut || false;
  word.wordIsIrregular = wordIsIrregular || false
}

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
