import { ucfirst } from "app/app/functions/ucfirst";

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
      { value: 1, title: "A1" },
      { value: 2, title: "A2" },
      { value: 3, title: "B1" },
      { value: 4, title: "B2" },
      { value: 5, title: "C1" },
      { value: 6, title: "C2" },
    ],
  },

  {
    name: "importance",
    alwaysShow: true,
    isNumber: true,
    options: [
      { value: 1, title: "Very unimportant" },
      { value: 2, title: "Unimportant" },
      { value: 3, title: "Normal" },
      { value: 4, title: "Important" },
      { value: 5, title: "Very important" },
    ],
  },
  {
    name: "difficulty",
    alwaysShow: true,
    isNumber: true,
    options: [
      { value: 1, title: "Not difficult" },
      { value: 2, title: "Difficult for beginners" },
      { value: 3, title: "Difficult for intermediate" },
      { value: 4, title: "Difficult for advanced" },
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
];

export const row_info = row_info_array.reduce((prev, row) => {
  return { ...prev, [row.name]: row };
}, {});

export const row_titles = Object.keys(row_info);

export const formatRowName = (i) => {
  if (!i) return "";
  return ucfirst(i).replaceAll("_", " ");
};
