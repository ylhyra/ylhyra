import { getPlaintextFromUnformattedVocabularyEntry } from "flashcards/flashcards/actions/format/format";

export function getPossibleAlternativeIds(input: string): string[] {
  if (!input) return [];
  // if (Array.isArray(input)) {
  //   return getPossibleAlternativeIds(
  //     input.map(getPlaintextFromUnformattedVocabularyEntry).join(";")
  //   );
  // }
  const original = getPlaintextFromUnformattedVocabularyEntry(input);
  const lowercase = original.toLowerCase();
  const withoutPeriodsOrQuestionMarks = lowercase.replace(/[.?!]+$/, "");

  return [original, lowercase, withoutPeriodsOrQuestionMarks];
}
