import _hash from "modules/hash";
import { isBrowser } from "modules/isBrowser";
import { getUserFromCookie } from "ylhyra/app/user/actions";
import { getPlaintextFromVocabularyEntry } from "ylhyra/vocabulary/compiler/parseVocabularyFile/format/functions";

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

export const getLowercaseStringForAudioKey = (i: string) => {
  return getPlaintextFromVocabularyEntry(i).replace(/[.]+$/, "").toLowerCase();
};

export const getHash = (
  input: string[] | string,
  options?: { skip_hash?: Boolean }
): string => {
  if (!input) return "";
  if (Array.isArray(input)) {
    return getHash(input.map(getPlaintextFromVocabularyEntry).join(";"));
  }
  const string = getPlaintextFromVocabularyEntry(input)
    .replace(/[.?!]+$/, "")
    .toLowerCase();
  if (!string) return "";
  /** Todo: This has to be removed from here, but it is used to find missing entries */
  if (
    options?.skip_hash ||
    (isBrowser &&
      ("skip_hash" in window || window.location.pathname === "/maker"))
  ) {
    return string;
  }
  return _hash(string);
};

export const getHashesFromCommaSeperated = (i: string[] | string): string[] => {
  if (!i) return [];
  if (Array.isArray(i)) {
    return i.map((i) => getHash(i));
  }
  return i
    .split(",")
    .map((i) => getHash(i))
    .filter(Boolean);
};
