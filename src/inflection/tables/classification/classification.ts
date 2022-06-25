/** Processes the description list */

import {
  Description,
  descriptions,
} from "inflection/tables/classification/descriptionsList";
import {
  GrammaticalCategory,
  GrammaticalTag,
  GrammaticalTagOrVariantNumber,
  InflectionalCategoryList,
} from "inflection/tables/types";

/**
 * Object containing "name => array of tags", used for
 * getting arrays later on, such as types['gender']
 */
let grammaticalCategories: Partial<
  Record<GrammaticalCategory, GrammaticalTag[]>
> = {};

export function getOrderedGrammaticalCategories(
  grammaticalCategory: GrammaticalCategory
): GrammaticalTag[] {
  if (!(grammaticalCategory in grammaticalCategories)) {
    throw new Error(`Grammatical category ${grammaticalCategory} not found`);
  }
  return grammaticalCategories[grammaticalCategory]!;
}

/** Abbreviations. Object on form {'nf': 'nominative'} */
let shortcuts: Record<string, GrammaticalTag> = {};

/** Icelandic shortcuts used in the BÍN database */
let shortcutsUsedInBin: Record<string, GrammaticalTag> = {};

/**
 * Sorted single-userLevel array of tags, used
 * for sorting rows when constructing the tree
 */
let sortedTags: InflectionalCategoryList = [];

/** Reverses `descriptions` to turn it into a searchable object */
let titleToDescription: Record<GrammaticalTag, Description> = {};

descriptions.forEach((description) => {
  /* Categories */
  if (description.category) {
    if (!grammaticalCategories[description.category]) {
      grammaticalCategories[description.category] = [];
    }
    grammaticalCategories[description.category]!.push(description.title);
  }

  /* Shortcuts */
  [
    ...description.shortcuts,
    description.title,
    description.icelandic_title,
  ].forEach((shortcut, index) => {
    if (shortcut in shortcuts) {
      throw new Error(`SHORTCUT ALREADY EXISTS ${shortcut}`);
    }
    shortcuts[shortcut] = description.title;
    /** The shortcut list begins with the shortcut used in BÍN */
    if (index === 0) {
      shortcutsUsedInBin[shortcut] = description.title;
    }
  });

  /* Sorted tags */
  sortedTags.push(description.title);

  /* Reverse lookup */
  titleToDescription[description.title] = description;
});

const categoryAliases: Partial<
  Record<GrammaticalCategory, GrammaticalCategory[]>
> = {
  article: ["articles"],
  plurality: ["number"],
  case: ["cases"],
  gender: ["genders"],
  person: ["persons"],
};
(Object.keys(categoryAliases) as GrammaticalCategory[]).forEach((key) => {
  categoryAliases[key]!.forEach((type) => {
    grammaticalCategories[type] = grammaticalCategories[key];
  });
});

/** Returns a full English canonical grammatical tag title */
export const getCanonicalGrammaticalTag = (
  tag: GrammaticalTagOrVariantNumber,
  strict: Boolean = true
): GrammaticalTagOrVariantNumber => {
  // if (!tag) return null;
  if (typeof tag === "number") return tag;
  if (/^\d+?$/.test(tag))
    return parseInt(tag); /* Number on the form of a string */
  if (typeof tag !== "string")
    throw new Error(`getCanonicalGrammaticalTag received type ${typeof tag}`);
  let output: string = shortcuts[tag] || shortcuts[tag.toLowerCase().trim()];
  if (!output && strict !== false)
    throw new Error(`Value not recognized: ${tag}`);
  return output;
};

export function getDescriptionFromGrammaticalTag(
  tag: GrammaticalTagOrVariantNumber,
  strict?: Boolean
): Description | null {
  tag = getCanonicalGrammaticalTag(tag, strict);
  return tag
    ? titleToDescription[getCanonicalGrammaticalTag(tag, strict)]
    : null;
}

export { shortcuts };
export { sortedTags };
export { grammaticalCategories };
export { shortcutsUsedInBin };
