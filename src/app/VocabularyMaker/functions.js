import _hash from "app/App/functions/hash";

export const getRawTextFromVocabularyEntry = (input) => {
  return input
    .replace(/{{(ð?u)}}/g, "$1")
    .replace(/{{g(?:ray)?\|(.*?)}}/g, "$1")
    .replace(/\(note: .*?\)/g, "")
    .replace(/∆/g, ",")
    .replace(/'''/g, "")
    .replace(/''/g, "")
    .replace(/%/g, "")
    .replace(/[\s]+/g, " ")
    .trim();
};

export const formatVocabularyEntry = (input) => {
  if (!input) return "";
  return input
    .replace(/∆/g, ",")
    .replace(/{{(ð?u)}}/g, `<i class="gray">$1</i>`)
    .replace(/{{g(?:ray)?\|(.*?)}}/g, `<span class="gray">$1</span>`)
    .replace(/(\(note: .*?\))/g, `<small class="gray">$1</small>`)
    .replace(/'''(.+?)'''/g, "<b><u>$1</u></b>")
    .replace(/\*(.+?)\*/g, "<b><u>$1</u></b>")
    .replace(/;;/g, `MAJOR_SEPERATOR`)
    .replace(/;/g, `<span class="seperator">,</span>`)
    .replace(/MAJOR_SEPERATOR/g, `<span class="seperator">;</span>`)
    .replace(/%/g, "");
};

export const clean_string = (i) => {
  if (!i) return null;
  return i
    .replace(/;;/g, "MAJOR_SEPERATOR")
    .replace(/;/g, "MINOR_SEPERATOR")
    .replace(/∆/g, ",")

    .replace(/\*/g, "")
    .replace(/\\,/g, ",")
    .replace(/'{2,}/g, "")
    .replace(/\s+/g, " ")
    .replace(/%/g, "")
    .trim();
};

export const simplify_string = (i) => {
  const string = clean_string(i).replace(/[.]+$/, "").toLowerCase();
  return string;
};

export const getHash = (i) => {
  if (Array.isArray(i)) {
    return getHash(i.map(clean_string).join(";"));
  }
  const string = clean_string(i)
    .replace(/[.?!]+$/, "")
    .toLowerCase();
  if (!string) return null;
  return string; //TEMP
  // return _hash(string);
};

export const getHashesFromCommaSeperated = (i) => {
  if (!i) return [];
  if (Array.isArray(i)) {
    return i.map(getHash);
  }
  return i.split(",").map(getHash).filter(Boolean);
};

export const row_titles = [
  // "icelandic",
  // "english",
  "depends_on",
  "basic_form",
  "this is a minor variation of",
  "level",
  "dont_confuse",
  "related_items",
  "direction",
  "note_bfr_show",
  "note_after_show",
  "note_after_show_is",
  "grammar_note f/icelandic",
  "literally",
  "pronunciation",
  "should_teach",
  "categories",
  "grammar_tags",
  "importance",
  "show_hint",
  "should_split",
  "alternative_id",
  "Laga?",
  "eyða",
];
