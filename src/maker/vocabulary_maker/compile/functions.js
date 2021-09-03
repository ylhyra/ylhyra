import _hash from "app/app/functions/hash";
import { isBrowser } from "app/app/functions/isBrowser";
import { getPlaintextFromVocabularyEntry } from "./index";

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
  "import { getUserFromCookie } from 'app/user/actions';
show_hint",
  "should_split",
  "example_declension",
  "athugasemd_til_min",
  "fix",
  "eyða",
];

export function getHash(input, options) {
  if (!input) return null;
  if (Array.isArray(input)) {
    return getHash(input.map(getPlaintextFromVocabularyEntry).join(";"));
  }
  const string = getPlaintextFromVocabularyEntry(input)
    .replace(/[.,]/, "")
    // .replace(/[.?!]+$/, "")
    .toLowerCase()
    .trim();
  if (!string) return null;
  // return string;
  if (
    options?.skip_hash ||
    (isBrowser && (window.skip_hash || window.location.pathname === "/maker"))
  ) {
    return string;
  }
  return _hash(string);
}

export const GetLowercaseStringForAudioKey = (i) => {
  const string = getPlaintextFromVocabularyEntry(i)
    .replace(/[.]+$/, "")
    .toLowerCase();
  return string;
};

export const getHashesFromCommaSeperated = (i) => {
  if (!i) return [];
  if (Array.isArray(i)) {
    return i.map(getHash);
  }
  return i.split(",").map(getHash).filter(Boolean);
};

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
