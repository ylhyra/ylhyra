/**
 * Input is any unformatted string such as the raw Icelandic side or English side.
 * This plaintext is then derived from stripping the HTML from {@link formatVocabularyEntry}.
 */

import {
  formatVocabularyEntry,
  getPlaintextFromFormatted,
} from "flashcards/flashcards/make/format/tmp";

export const getPlaintextFromUnformattedVocabularyEntry = (
  input: string | undefined
) => {
  if (!input) return "";
  return getPlaintextFromFormatted(formatVocabularyEntry(input));
};
