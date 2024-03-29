/* Match the "%" in lemmas, which serves to mark something as both the basic form and an alt_id */
import _hash from "app/app/functions/hash";
import { isBrowser } from "app/app/functions/isBrowser";
import { getUserFromCookie } from "app/user/actions";
import { getPlaintextFromVocabularyEntry } from "maker/vocabulary_maker/compile/format";

/* Only used for testing */
export const getDeckName = () => {
  if (process.env.NODE_ENV === "development") {
    if (getUserFromCookie()?.username === "danska") {
      return "_da";
    }
    if (getUserFromCookie()?.username === "spænska") {
      return "_es";
    }
    if (getUserFromCookie()?.username === "norska") {
      return "_no";
    }
  }
  return "";
};

export const GetLowercaseStringForAudioKey = (i) => {
  const string = getPlaintextFromVocabularyEntry(i)
    .replace(/[.]+$/, "")
    .toLowerCase();
  return string;
};

export const getHash = (input, options) => {
  if (!input) return null;
  if (Array.isArray(input)) {
    return getHash(input.map(getPlaintextFromVocabularyEntry).join(";"));
  }
  const string = getPlaintextFromVocabularyEntry(input)
    .replace(/[.?!]+$/, "")
    .toLowerCase();
  if (!string) return null;
  // return string;
  if (
    options?.skip_hash ||
    (isBrowser && (window.skip_hash || window.location.pathname === "/maker"))
  ) {
    return string;
  }
  return _hash(string);
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
  "lemmas",
  "depends_on",
  "alternative_id",
  "level",
  "dont_confuse",
  "related_items",
  "direction",
  "note",
  "note_regarding_english",
  // "note_bfr_show",
  // "note_after_show",
  // "note_after_show_is",
  "literally",
  "pronunciation",
  "should_teach",
  "categories",
  "grammar_tags",
  "importance",
  "show_hint",
  "should_split",
  "example_declension",
  "athugasemd_til_min",
  "fix",
  "eyða",
];

export const automaticThu = (input) => {
  return input
    .replace(/\b(ert)u\b/gi, "$1{{u}}")
    .replace(/\b(ætlar)ðu\b/gi, "$1{{ðu}}");
};
