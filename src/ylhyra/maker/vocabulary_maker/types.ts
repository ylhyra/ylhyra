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
import { VocabularyFileRow } from "ylhyra/maker/vocabulary_maker/compile/rowTitles";
import { getSounds } from "ylhyra/server/vocabulary/compile/getSounds";

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
  "en_plaintext": string;
  "en_formatted": string;
  "terms": TermIds;
  "level": LevelsEnum;
  "importance"?: ImportanceEnum;
  "difficulty"?: DifficultyEnum;
  "pronunciation"?: string;
  "lemmas"?: string;
  "note_regarding_english"?: string;
  "note"?: string;
  "literally"?: string;
  "row_id": number;
  "example_declension"?: string;
  "synonyms"?: string;
  "is_plaintext": string;
  "is_formatted": string;
  "from": "is" | "en";
  "id": CardId;
  "spokenSentences"?: string[];
  "sound": ReturnType<typeof getSounds>;
  "isSentence"?: Boolean;
  "sortKey": number;

  /** Used in backend, TODO: delete */
  "should_teach"?: string;
  "fix"?: string;
  "eyða"?: string;
  "this is a minor variation of"?: string;
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
