// @ts-ignore
import { remove } from "diacritics";

/** Icelandic-specific diacritic removal */
export function removeDiacritics(string: string): string {
  if (!string) return string;
  return remove(
    string
      .replace(/Þ/g, "Th")
      .replace(/Ð/g, "D")
      .replace(/Ö/g, "O")
      .replace(/þ/g, "th")
      .replace(/ð/g, "d")
      .replace(/ö/g, "o")
  );
}

export function removeNonLetters(string: string): string {
  if (!string) return string;
  return string.replace(/[^\p{Script=Latin}]/giu, "");
}
