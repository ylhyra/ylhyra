import { removeInflectionalPattern } from "inflection/tables/functions/patterns";
import {
  isVowellikeCluster,
  removeLastVowelCluster,
  removeVowellikeClusters,
  splitOnVowelRegions,
} from "inflection/tables/functions/vowels";
import Word from "inflection/tables/word";
import _ from "lodash";
import { filterEmpty } from "modules/typescript/filterEmpty";

/**
 * Gets the stem of a word. See: https://is.wikipedia.org/wiki/Stofn_(málfræði)
 */
export function getStem(
  this: Word,
  options?: {
    masculinizeAdjectiveStem?: Boolean;
    trimExtra?: Boolean;
  }
): string {
  let word = this;
  let selection;
  let output: string | undefined;
  if (this.is("noun")) {
    if (this.isStrong()) {
      selection = this.getOriginal().get(
        "accusative" /*'without definite article', 'singular' */
      );
    } else {
      output = this.getOriginal()
        .get("nominative" /*'without definite article', 'singular' */)
        .getFirstValue();
      output = removeLastVowelCluster(output);
    }
  }
  if (this.is("adjective")) {
    output = this.getOriginal()
      .get(
        "feminine" /* 'nominative', 'singular', 'positive degree', 'strong declension'*/
      )
      .getFirstValue();
    // if (!output) return;

    /**
     * For the purpose of highlighting umlauts,
     * we want to get the stem with the vowel that's
     * used in the masculine gender
     */
    if (output && options?.masculinizeAdjectiveStem) {
      const stemLength = splitOnVowelRegions(output).filter(Boolean).length;
      let masculine = this.getOriginal()
        .get(
          "masculine",
          "nominative",
          "singular",
          /*'positive degree',*/ "strong declension"
        )
        .getFirstValue();
      if (masculine) {
        return splitOnVowelRegions(masculine)
          .filter(Boolean)
          .slice(0, stemLength)
          .join("");
      } else {
        // console.log(output)
        return output;
      }
    } else {
      // return output
    }
  }
  // if (this.is('numeral')) {
  //   output = this.getOriginal().get('feminine', 'nominative', 'singular').getFirstValue()
  // }
  if (this.is("verb")) {
    output = this.getOriginal()
      .get("clipped imperative" /*'active voice'*/)
      .getFirstValue();
    /* Remove last vowel */
    if (this.isWeak()) {
      output = removeLastVowelCluster(output);
    } else {
      // return output
    }
  }
  if (this.isAny("numeral", "personal pronoun")) {
    output = this.getOriginal().getFirstValue();
  }

  if (selection) {
    output = selection.getFirstValue();
  }

  if (!output) {
    output = attemptToGenerateStem(word);
  }

  /* Trim even further */
  if (options?.trimExtra && selection && output) {
    output = removeInflectionalPattern(output, selection);
  }

  return output || "";
}

/**
 * If no stem can be found, attempt to generate it by finding the most common region of unchanged consonants.
 * Todo: May not work with singe letter words
 */
const attemptToGenerateStem = (word: Word): string => {
  let values: string[] = word
    .getOriginal()
    .rows.map((row) =>
      removeInflectionalPattern(row.inflectional_form, new Word([row], word))
    )
    .filter(filterEmpty);
  let valuesWithVowelsRemoved = values.map(removeVowellikeClusters);
  let shortest = Math.min(...valuesWithVowelsRemoved.map((i) => i.length));
  let cut = valuesWithVowelsRemoved.map((i) => i.slice(0, shortest));
  const mostCommonConsonantBeginning = _.head(
    _(cut).countBy().entries().maxBy(_.last)
  ) as string;
  const firstVariantMatching = values.find((i) =>
    removeVowellikeClusters(i)?.slice(0, shortest)
  );

  /* Find match based on consonants */
  let output = "";
  let currentConsonantIndex = 0;
  let done = false;
  if (firstVariantMatching) {
    for (const letter of firstVariantMatching.split("")) {
      if (!done) {
        if (!isVowellikeCluster(letter)) {
          currentConsonantIndex++;
          if (currentConsonantIndex >= mostCommonConsonantBeginning.length) {
            done = true;
          }
        }
        output += letter;
      }
    }
  }

  /* If the above failed, try to find match using vowels as well */
  if (!output) {
    let shortest2 = Math.min(...values.map((i) => i.length));
    let cut2 = values.map((i) => i.slice(0, shortest2));
    const mostCommonBeginning2 = _.head(
      _(cut2).countBy().entries().maxBy(_.last)
    ) as string;
    return mostCommonBeginning2;
  }

  // if (word.isStrong()) {
  //
  // }

  return output;
};
