import { uppercaseFirstLetter } from "modules/uppercaseFirstLetter";
import {
  A1,
  A2,
  B1,
  B2,
  C1,
  C2,
  DIFFICULT_FOR_ADVANCED,
  DIFFICULT_FOR_BEGINNERS,
  DIFFICULT_FOR_INTERMEDIATE,
  IMPORTANT,
  NORMAL_IMPORTANCE,
  NOT_DIFFICULT,
  UNIMPORTANT,
  VERY_IMPORTANT,
  VERY_UNIMPORTANT,
} from "ylhyra/vocabulary/app/constants";

export const vocabularyRowStructure = [
  { name: "icelandic", alwaysShow: true },
  { name: "english", alwaysShow: true },
  { name: "lemmas", alwaysShow: true },
  { name: "depends_on", alwaysShow: true },
  { name: "alternative_id" },
  { name: "this_is_a_minor_variation_of" },
  {
    name: "level",
    alwaysShow: true,
    isNumber: true,
    options: [
      { value: A1, title: "A1" },
      { value: A2, title: "A2" },
      { value: B1, title: "B1" },
      { value: B2, title: "B2" },
      { value: C1, title: "C1" },
      { value: C2, title: "C2" },
    ],
  },

  {
    name: "importance",
    alwaysShow: true,
    isNumber: true,
    options: [
      { value: VERY_UNIMPORTANT, title: "Very unimportant" },
      { value: UNIMPORTANT, title: "Unimportant" },
      { value: NORMAL_IMPORTANCE, title: "Normal" },
      { value: IMPORTANT, title: "Important" },
      { value: VERY_IMPORTANT, title: "Very important" },
    ],
  },

  {
    name: "difficulty",
    alwaysShow: true,
    isNumber: true,
    options: [
      { value: NOT_DIFFICULT, title: "Not difficult" },
      { value: DIFFICULT_FOR_BEGINNERS, title: "Difficult for beginners" },
      {
        value: DIFFICULT_FOR_INTERMEDIATE,
        title: "Difficult for intermediate",
      },
      { value: DIFFICULT_FOR_ADVANCED, title: "Difficult for advanced" },
    ],
  },

  { name: "dont_confuse" },
  { name: "related_items" },
  { name: "direction" },
  { name: "note" },
  { name: "note_regarding_english" },
  { name: "literally" },
  { name: "synonyms" }, //Todo

  { name: "pronunciation" },
  { name: "categories" },
  { name: "grammar_tags" },

  { name: "example_declension" },
  { name: "athugasemd_til_min" },
  { name: "fix" },
  { name: "eyða" },
] as const;

export const vocabularyRowStructureAsObject = vocabularyRowStructure.reduce(
  (prev, row) => {
    return { ...prev, [row.name]: row };
  },
  {}
);

export const vocabularyRowTitles = Object.keys(vocabularyRowStructureAsObject);
export type VocabularyRowTitles = keyof typeof vocabularyRowTitles;

export const formatRowName = (i: string): string => {
  if (!i) return "";
  return (
    uppercaseFirstLetter(i)
      // @ts-ignore
      .replaceAll("_", " ")
  );
};