import _hash from "modules/hash";
import { isBrowser } from "modules/isBrowser";
import { getUserFromCookie } from "ylhyra/app/user/actions";
import { getPlaintextFromVocabularyEntry } from "ylhyra/maker/vocabulary_maker/compile/format";

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
    if (getUserFromCookie()?.username === "þýska") {
      return "_de";
    }
  }
  return "";
};

export const GetLowercaseStringForAudioKey = (i) => {
  return getPlaintextFromVocabularyEntry(i).replace(/[.]+$/, "").toLowerCase();
};

export const getHash = (input, options?): string => {
  if (!input) return "";
  if (Array.isArray(input)) {
    return getHash(input.map(getPlaintextFromVocabularyEntry).join(";"));
  }
  const string = getPlaintextFromVocabularyEntry(input)
    .replace(/[.?!]+$/, "")
    .toLowerCase();
  if (!string) return "";
  if (
    options?.skip_hash ||
    (isBrowser &&
      ("skip_hash" in window || window.location.pathname === "/maker"))
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

export const automaticThu = (input) => {
  return input
    .replace(/\b(ert)u\b/gi, "$1{{u}}")
    .replace(/\b(ætlar)ðu\b/gi, "$1{{ðu}}");
};
