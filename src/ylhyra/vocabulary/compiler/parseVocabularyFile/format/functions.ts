import { removeExtraWhitespace } from "ylhyra/app/app/functions/removeExtraWhitespace";
import { formatVocabularyEntry } from "ylhyra/vocabulary/compiler/parseVocabularyFile/format/format";

/**
 * Input is any unformatted string such as the raw Icelandic side or English side.
 * This plaintext is then derived from stripping the HTML from {@link formatVocabularyEntry}.
 */
export const getPlaintextFromUnformattedVocabularyEntry = (
  input: string | undefined
) => {
  if (!input) return "";
  return getPlaintextFromFormatted(formatVocabularyEntry(input));
};

/**
 * Strips the HTML from {@link formatVocabularyEntry}
 */
export const getPlaintextFromFormatted = (
  input: string | undefined
): string => {
  if (!input) {
    console.error("Missing plaintext!");
    return "";
  }
  return removeExtraWhitespace(
    input
      .replace(/<span class="separator">,<\/span>/g, ";")
      .replace(/<span class="separator">;<\/span>/g, ";;")
      .replace(/<\/li><li>/g, ";; ")
      .replace(/<.+?>/g, "")
      .replace(/[—–]/g, "-")
      .replace(/  +/g, " ")
      .replace(/†/g, "")
  );
};

/**
 * In {@link formatVocabularyEntry}, the Icelandic side of a word can
 * highlight which part of a word is the "þú" part (e.g. in "farðu").
 *
 * This is done by enclosing the "þú" part in curly braces as such:
 *   - vilt{{u}}
 *   - kemur{{ðu}}
 *
 * The words "ætlarðu" and "ertu" are automatically given these curly braces,
 * as they are so common ({@see automaticThuForCommonWords}).
 *
 * When the "þú" part is marked in this way, it will do two things:
 *   1. the "þú" part will be shown as gray after the user has responded
 *   2. a note will be shown in the footer of the card explaining the merger
 */
export const DocumentationRegardingThuMerging = "";

/**
 * {@see DocumentationRegardingThuMerging}
 */
export const automaticThuForCommonWords = (input: string) => {
  return input
    .replace(/\b(ert)u\b/gi, "$1{{u}}")
    .replace(/\b(ætlar)ðu\b/gi, "$1{{ðu}}");
};
