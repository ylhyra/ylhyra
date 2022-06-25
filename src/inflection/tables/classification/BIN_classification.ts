import {
  getCanonicalGrammaticalTag,
  shortcutsUsedInBin,
} from "inflection/tables/classification/classification";
import {
  GrammaticalTag,
  InflectionalCategoryList,
  Row,
  RowFromDatabase,
} from "inflection/tables/types";

/**
 * Turns BÍN's classifications into English
 *
 * The following attributes of the input object are taken into consideration:
 *
 * - Word_categories
 * - Grammatical_tag
 * - BIN_domain
 *
 * Returns the inputted object with the following keys removed:
 *
 * - Word_categories
 * - Grammatical_tag And the following keys added:
 * - Word_categories - An array of values that apply to all the forms of the
 *   word (a noun, adjective...)
 * - Inflectional_form_categories - An array of values that only apply to
 *   certain forms of the word (plurality, case...)
 *
 * @hasTests
 */
export function classify(input: RowFromDatabase): Row {
  let { word_categories, grammatical_tag, BIN_domain, ...rest } = input;
  if (!word_categories && !grammatical_tag) {
    throw new Error("Malformed input from database");
  }

  /* Word categories */
  word_categories = word_categories?.toLowerCase() || "";
  let word_categories_output =
    get_label_for_BIN_word(word_categories).split(", ");

  if (BIN_domain && relevant_BIN_domains[BIN_domain]) {
    word_categories_output.push(relevant_BIN_domains[BIN_domain]);
  }

  let inflectional_form_categories: InflectionalCategoryList = [];
  let original_grammatical_tag = grammatical_tag;
  grammatical_tag = grammatical_tag?.toLowerCase() || "";
  /* Adjectives: Arrange plurality before gender */
  grammatical_tag = grammatical_tag.replace(
    /(KK|KVK|HK)-(NF|ÞF|ÞGF|EF)(ET|FT)/i,
    "$3-$1-$2"
  );
  /* Nouns: Arrange plurality before case */
  grammatical_tag = grammatical_tag.replace(/(NF|ÞF|ÞGF|EF)(ET|FT)/i, "$2-$1");
  grammatical_tag
    .split(new RegExp(`(${grammaticalTagsUsedInBinRegex})`, "g"))
    .filter(Boolean)
    .forEach((tag) => {
      if (tag === "-") return;
      /** Test if tag is a number, which indicates a variant */
      if (/^\d+$/.test(tag + "")) {
        // inflectional_form_categories.push(tag)
      } else if (get_label_for_BIN_inflection_form(tag)) {
        inflectional_form_categories.push(
          get_label_for_BIN_inflection_form(tag)
        );
      } else {
        if (process.env.NODE_ENV === "development") {
          console.error(
            `Unknown tag in BIN_classification.js: ${tag}. Full tag is ${grammatical_tag}`
          );
        }
      }
    });

  inflectional_form_categories = inflectional_form_categories
    .join(", ")
    .split(", ");

  /* Add "without definite article" to nouns */
  if (
    word_categories_output.includes("noun") &&
    !inflectional_form_categories.includes("with definite article")
  ) {
    inflectional_form_categories.push("without definite article");
  }

  // /* Add "personal use" to verbs */
  // if (word_categories_output.includes('verb') &&
  //   !inflectional_form_categories.find(i => i.startsWith('impersonal') &&
  //     !inflectional_form_categories.includes('question form')
  //   )) {
  //   inflectional_form_categories = ['personal', ...inflectional_form_categories]
  // }

  /* If it ends in a number it is an alternative version */
  // const variantNumber = (
  //   grammatical_tag.match(/(\d)$/) ? grammatical_tag.match(/(\d)$/)?.[0]! : 1
  // ).toString();
  // // inflectional_form_categories.push(parseInt(variantNumber));
  const variant_number = parseInt(grammatical_tag.match(/(\d)$/)?.[0] || "1");
  inflectional_form_categories.push(variant_number);

  /** Make sure output is the correct type */
  if (typeof rest.correctness_grade_of_word === "string") {
    rest.correctness_grade_of_word = parseInt(rest.correctness_grade_of_word);
  }
  if (typeof rest.correctness_grade_of_inflectional_form === "string") {
    rest.correctness_grade_of_inflectional_form = parseInt(
      rest.correctness_grade_of_inflectional_form
    );
  }

  return {
    word_categories: word_categories_output,
    inflectional_form_categories,
    original_grammatical_tag,
    BIN_domain,
    variant_number,
    ...rest,
  };
}

/** Overrides the tags in "classification.js" during the BIN initialization step */
const BIN_overrides: {
  word_overrides: Record<string, string>;
  inflection_form_overrides: Record<string, string>;
} = {
  word_overrides: {
    kk: "noun, masculine",
    kvk: "noun, feminine",
    hk: "noun, neuter",
  },
  inflection_form_overrides: {
    fsb: "positive degree, strong declension",
    fvb: "positive degree, weak declension",
    evb: "superlative degree, weak declension",
    esb: "superlative degree, strong declension",
    gr: "with definite article",
    st: "clipped imperative",
  },
};

export const get_label_for_BIN_word = (tag: GrammaticalTag) => {
  return (
    BIN_overrides.word_overrides[tag] ||
    (getCanonicalGrammaticalTag(tag) as GrammaticalTag) ||
    ""
  );
};

export const get_label_for_BIN_inflection_form = (tag: GrammaticalTag) => {
  return (
    BIN_overrides.inflection_form_overrides[tag] ||
    (getCanonicalGrammaticalTag(tag) as GrammaticalTag) ||
    ""
  );
};

const grammaticalTagsUsedInBinRegex = (() => {
  let tags = [
    ...Object.keys(shortcutsUsedInBin),
    ...Object.keys(BIN_overrides.word_overrides),
    ...Object.keys(BIN_overrides.inflection_form_overrides),
  ];
  return tags
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .join("|");
})();

/**
 * We are only interested in knowing whether a word is a name
 * or not See https://bin.arnastofnun.is/ordafordi/hlutiBIN/
 */
export const relevant_BIN_domains: Record<string, string> = {
  ism: "human name",
  erm: "human name", // Foreign human name
  föð: "patronymic",
  móð: "matronymic",
  gæl: "human nickname",
  ætt: "surname",
  hetja: "name",

  bær: "place name",
  göt: "place name",
  lönd: "place name",
  þor: "place name",
  örn: "place name",
  erl: "place name",
};
