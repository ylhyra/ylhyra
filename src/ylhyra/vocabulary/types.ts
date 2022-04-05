import {
  CardId,
  CardIds,
  TermId,
  TermIds,
} from "ylhyra/vocabulary/app/actions/card/types";
import {
  DifficultyEnum,
  ImportanceEnum,
  LevelsEnum,
} from "ylhyra/vocabulary/app/constants";
import { getSounds } from "ylhyra/vocabulary/compiler/compiler.server/getSounds.server";

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

export type VocabularyFileEntry = Partial<{
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
  rows: VocabularyFileEntry[];
  sound: VocabularyFileSoundEntry[];
};

export type VocabularyFileSoundEntry = {
  recording_of: string;
  filename: string;
  speed: string;
  speaker: string;
  date: string;
};

export type DeckDatabase = {
  cards: Cards;
  terms: Terms;
  dependencies: Dependencies;
  alternativeIds: Dependencies;
};
export type Terms = {
  [id: TermId]: { cards: CardIds; dependencies?: TermIdToDependencyDepth };
};
export type Cards = { [key: CardId]: CardData };
export type Dependencies = { [id: TermId]: TermIds };
export type TermIdToDependencyDepth = Record<TermId, number>;
