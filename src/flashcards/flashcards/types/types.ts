import { DeckSettings } from "flashcards/flashcards/types/deckSettings";
import { Row, RowId } from "flashcards/flashcards/types/row";
import { Days, Timestamp } from "modules/time";
import { Brand } from "ts-brand";

export type RowsObject = Record<RowId, Row>;

export type DeckId = string;
export type UnprocessedDeck = {
  deckId: DeckId;
  rows: RowsObject;
  settings: DeckSettings;
};
export type DeckIdToUnprocessedDeck = Record<DeckId, UnprocessedDeck>;

export type DirectionSettings =
  | "BOTH"
  | "ONLY_FRONT_TO_BACK"
  | "ONLY_BACK_TO_FRONT";

export enum Direction {
  FRONT_TO_BACK = "1",
  BACK_TO_FRONT = "2",
}

export type DeckIdToProcessedDeck = Record<DeckId, ProcessedDeck>;
export type ProcessedDeck = {
  deckId: DeckId;
  cards: Record<
    CardId,
    {
      termId: TermId;
    }
  >;
  terms: Record<
    TermId,
    {
      cardIds: CardIds;
    }
  >;
  /**
   * Sentences pointing to termIds
   */
  alternativeIds: Record<RawText, TermId[]>;
  /**
   * This term depends on which sentences?
   * (Note, these sentences point to an alternativeId)
   */
  dependenciesUnprocessed: Record<TermId, RawText[]>;
  dependencyGraph: DependenciesForAllTermsAsTermIdToDependencyToDepth;
  // /** TODO: Remove? */
  // dependencyList: Record<TermId, TermId[]>;
};

export type ProcessedCardExtraInformation = {
  isSentence: boolean;
};

export enum ImportanceEnum {
  VERY_UNIMPORTANT = 1,
  UNIMPORTANT = 2,
  NORMAL_IMPORTANCE = 3,
  IMPORTANT = 4,
  VERY_IMPORTANT = 5,
}
export enum CefrEnum {
  A1 = 1,
  A2 = 2,
  B1 = 3,
  B2 = 4,
  C1 = 5,
  C2 = 6,
}
export enum Rating {
  BAD = 1,
  GOOD = 2,
  EASY = 3,
}

/**
 * A number between 1 (Bad) and 4 (Excellent).
 * If a card was rated as bad, its score will be set to "1" regardless
 * of how often it has been seen before.
 * A new card rated as good will have a score of "2".
 * A new card rated as easy will have a score of "3".
 *
 * Any time a card is later rated as good or easy, its score will
 * be incremented by {@link SCORE_IS_INCREMENTED_BY_HOW_MUCH_IF_RATED_GOOD_OR_EASY}.
 *
 * Score is calculated by {@link createSchedule}.
 * See also the related enum {@link Rating}
 */
export type Score = number;

/**
 * TermId and direction is encoded in CardId
 * @see createCardId
 */
export type CardId = Brand<string, "CardId">;
export type CardIds = CardId[];
export type TermId = Brand<string, "TermId">;
export type TermIds = TermId[];

/** TODO: Find a better name */
export type DependenciesForAllTermsAsTermIdToDependencyToDepth = Record<
  TermId,
  DependenciesForOneTermAsDependencyToDepth
>;
export type DependenciesForOneTermAsDependencyToDepth = Record<TermId, number>;
/** @deprecated */
export type CardIdToDependencyDepth = Record<CardId, number>;

export interface ScheduleData {
  due: Timestamp;
  lastIntervalInDays: Days /** Previously last_interval_in_days */;
  score: number;
  lastSeen: Timestamp;
  sessionsSeen: number;

  /* Í VINNSLU */
  lastBadTimestamp: Timestamp;
  numberOfBadSessions: number;
}

/**
 * Used for dependencies and such to redirect text to an id.
 */
export type RawText = Brand<string, "RawText">;
