import { ucfirst } from "app/app/functions/ucfirst";

const row_info_array = [
  { name: "icelandic", alwaysShow: true },
  { name: "english", alwaysShow: true },
  { name: "lemmas", alwaysShow: true },
  { name: "depends_on", alwaysShow: true },
  { name: "alternative_id" },
  { name: "this_is_a_minor_variation_of" },
  {
    name: "level",
    alwaysShow: true,
    options: {
      1: "A1",
      2: "A2",
      3: "B1",
      4: "B2",
      5: "C1",
      6: "C2",
    },
  },

  //todo:
  { name: "importance", alwaysShow: true },
  {
    name: "is_extremely_basic_phrase",
    alwaysShow: true,
    options: {
      0: "Not important",
      2: "Important",
      3: "Very important",
    },
  },
  {
    name: "is_surprisingly_difficult",
    alwaysShow: true,
    options: {
      0: "Not difficult",
      1: "Difficult for beginners",
      2: "Difficult for intermediate",
      3: "Difficult for advanced",
    },
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
