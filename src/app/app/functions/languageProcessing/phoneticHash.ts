import { removeDiacritics, removeNonLetters } from "app/app/functions/languageProcessing/removeDiacritics";

/**
 * Phonetic algorithm for Icelandic, similar to Cologne phonetics
 */
export default (string: string): string => {
  if (!string) return null;
  return (
    removeDiacritics(removeNonLetters(string))
      .toLowerCase()
      .replace(/au/g, "o")
      .replace(/sg/g, "sk")
      .replace(/hv/g, "kv")
      .replace(/fnd/g, "md")
      .replace(/fnt/g, "mt")
      .replace(/rl/g, "tl")
      .replace(/x/g, "ks")
      .replace(/(dn|rn|rdn)/g, "n")
      .replace(/mb/g, "m")

      // For English
      .replace(/y([aeiouy])/g, "j$1")
      .replace(/[z]/g, "s")
      .replace(/(sh)/g, "s")
      .replace(/(sc)/g, "s")
      .replace(/c([eiyo])/g, "k$1")
      .replace(/c/g, "s")

      .replace(/y/g, "i")
      .replace(/[aeiouyj]/g, "a")
      .replace(/(th|dh|d|t|h)/g, "d")
      .replace(/[fvw]/g, "v")
      .replace(/[pb]/g, "p")
      .replace(/[gkqc]/g, "k")
      .replace(/(l|dl)/g, "l")
      .replace(/[mn]/g, "n")
      .replace(/[rs]/g, "s")
      .replace(/([^\w\s])|(.)(?=\2)/g, "") // Remove two in a row
  );
};
