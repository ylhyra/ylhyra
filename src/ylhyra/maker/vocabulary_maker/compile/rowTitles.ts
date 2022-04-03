import { ucfirst } from "ylhyra/app/app/functions/ucfirst";
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
  DifficultyEnum,
  ImportanceEnum,
  IMPORTANT,
  LevelsEnum,
  NORMAL_IMPORTANCE,
  NOT_DIFFICULT,
  UNIMPORTANT,
  VERY_IMPORTANT,
  VERY_UNIMPORTANT,
} from "ylhyra/app/vocabulary/constants";

export type VocabularyFileRow = Partial<{
  row_id: number;
  icelandic: string;
  english: string;
  lemmas: string;
  depends_on: string;
  alternative_id: string;
  this_is_a_minor_variation_of: string;
  level: LevelsEnum;
  importance: ImportanceEnum;
  difficulty: DifficultyEnum;
  dont_confuse: string;
  related_items: string;
  direction: string;
  note: string;
  note_regarding_english: string;
  literally: string;
  synonyms: string;
  pronunciation: string;
  categories: string;
  grammar_tags: string;
  example_declension: string;

  athugasemd_til_min: string;
  fix: string;
  eyða: string;
  should_teach: "yes" | "no";
  should_split: "yes" | "no";
}>;

export const row_info_array = [
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

export const row_info = row_info_array.reduce((prev, row) => {
  return { ...prev, [row.name]: row };
}, {});

export const row_titles = Object.keys(row_info);

export type RowTitles = keyof typeof row_titles;

export const formatRowName = (i: string) => {
  if (!i) return "";
  return ucfirst(i).replaceAll("_", " ");
};
