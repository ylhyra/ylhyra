import _hash from "modules/hash";
import { isBrowser } from "modules/isBrowser";
import { getUserFromCookie } from "ylhyra/app/user/actions";
import { getPlaintextFromUnformattedVocabularyEntry } from "ylhyra/vocabulary/compiler/parseVocabularyFile/format/functions";
import { TermId } from "ylhyra/vocabulary/types";

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

export function getLowercaseStringForAudioKey(i: string) {
  return getPlaintextFromUnformattedVocabularyEntry(i)
    .replace(/[.]+$/, "")
    .toLowerCase();
}

/**
 * Gives a stable hash for a given word or sentence which is
 * then used as the card's {@link TermId}.
 *
 * Important: The output of this function has to be the same
 * as for previous versions.
 *
 * @param input - Typically an Icelandic string (front side of card).
 *       Lemmas and depends_on are also passed into this function.
 * @param options
 * @returns String - which is the baseFlashcardsStore of {@link TermId}
 * @hasTests
 */
export const getHashForVocabulary = (
  input: string[] | string,
  options?: { skip_hash?: Boolean }
): string => {
  if (!input) return "";
  if (Array.isArray(input)) {
    return getHashForVocabulary(
      input.map(getPlaintextFromUnformattedVocabularyEntry).join(";")
    );
  }
  const string = getPlaintextFromUnformattedVocabularyEntry(input)
    .replace(/[.?!]+$/, "")
    .toLowerCase();
  if (!string) return "";
  /**
   * Todo: This has to be removed from here,
   * but it is used to find missing entries
   */
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
    return i.map((i) => getHashForVocabulary(i));
  }
  return i
    .split(",")
    .map((i) => getHashForVocabulary(i))
    .filter(Boolean);
};
