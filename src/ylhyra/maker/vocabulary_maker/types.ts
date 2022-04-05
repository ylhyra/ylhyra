import {
  CardId,
  CardIds,
  TermId,
  TermIds,
} from "ylhyra/app/vocabulary/actions/card/types";
import {
  DifficultyEnum,
  ImportanceEnum,
  LevelsEnum,
} from "ylhyra/app/vocabulary/constants";
import { getSounds } from "ylhyra/server/vocabulary/compile/getSounds";

export type VocabularyFileRow = Partial<{
  "row_id": number;
  "icelandic": string;
  "english": string;
  "lemmas": string;
  "depends_on": string;
  "alternative_id": string;
  "this_is_a_minor_variation_of": string;
  "level": LevelsEnum;
  "importance": ImportanceEnum;
  "difficulty": DifficultyEnum;
  "dont_confuse": string;
  "related_items": string;
  "direction": string;
  "note": string;
  "note_regarding_english": string;
  "literally": string;
  "synonyms": string;
  "pronunciation": string;
  "categories": string;
  "grammar_tags": string;
  "example_declension": string;

  "athugasemd_til_min": string;
  "fix": string;
  "eyða": string;
  "should_teach": "yes" | "no";
  "should_split": "yes" | "no";
  "this is a minor variation of"?: string;
  /** ISO date */
  "last_seen"?: string;
}>;
export type VocabularyFile = {
  rows: VocabularyFileRow[];
  sound: Array<VocabularyFileSoundRow>;
};
export type VocabularyFileSoundRow = {
  recording_of: string;
  filename: string;
  speed: string;
  speaker: string;
  date: string;
};
export type CardData = {
  en_plaintext: string;
  en_formatted: string;
  terms: TermIds;
  level: LevelsEnum;
  importance?: ImportanceEnum;
  difficulty?: DifficultyEnum;
  pronunciation?: string;
  lemmas?: string;
  note_regarding_english?: string;
  note?: string;
  literally?: string;
  row_id: number;
  example_declension?: string;
  synonyms?: string;
  is_plaintext: string;
  is_formatted: string;
  from: "is" | "en";
  id: CardId;
  spokenSentences?: string[];
  sound: ReturnType<typeof getSounds>;
  isSentence?: Boolean;
  sortKey: number;

  /** Used in backend, TODO: delete */
  should_teach?: string;
  fix?: string;
  eyða?: string;
};
export type BackendTerms = {
  [id: TermId]: { cards: CardIds; dependencies?: TermIdToDependencyDepth };
};
export type TermIdToDependencyDepth = Record<TermId, number>;
export type BackendDependencies = { [id: TermId]: TermIds };
export type BackendCards = { [key: CardId]: CardData };
export type BackendDeck = {
  cards: BackendCards;
  terms: BackendTerms;
  dependencies: BackendDependencies;
  alternativeIds: BackendDependencies;
};
