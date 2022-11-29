import { RowId } from "flashcards/flashcards/actions/row/rowData";
import { Brand } from "ts-brand";

export type DirectionSettings =
  | "BOTH"
  | "ONLY_FRONT_TO_BACK"
  | "ONLY_BACK_TO_FRONT";

export enum Direction {
  FRONT_TO_BACK = "FRONT_TO_BACK",
  BACK_TO_FRONT = "BACK_TO_FRONT",
}

// export type ProcessedDeck = {
//   /**
//    * Sentences pointing to rowIds
//    */
//   alternativeIds: Record<RawText, RowId[]>;
//   /**
//    * This row depends on which sentences?
//    * (Note, these sentences point to an alternativeId)
//    */
//   dependenciesUnprocessed: Record<RowId, RawText[]>;
//   dependencyGraph: DependenciesForAllRowsAsRowIdToDependencyToDepth;
//   // /** TODO: Remove? */
//   // dependencyList: Record<RowId, RowId[]>;
// };

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
 * A number between 1 (Bad) and 4 (Excellent). If a card was rated as bad, its
 * score will be set to "1" regardless of how often it has been seen before. A
 * new card rated as good will have a score of "2". A new card rated as easy
 * will have a score of "3".
 *
 * Any time a card is later rated as good or easy, its score will be incremented
 * by {@link SCORE_IS_INCREMENTED_BY_HOW_MUCH_IF_RATED_GOOD_OR_EASY}.
 *
 * Score is calculated by {@link createSchedule}. See also the related enum
 * {@link Rating}
 */
export type Score = number;

/**
 * RowId and direction is encoded in CardId
 *
 * @see createCardId
 */
export type CardId = Brand<string, "CardId">;
export type CardIds = CardId[];
export type DeckId = Brand<string, "DeckId">;

/** TODO: Find a better name */
export type DependenciesForAllRowsAsRowIdToDependencyToDepth = Record<
  RowId,
  DependenciesForOneRowAsDependencyToDepth
>;
export type DependenciesForOneRowAsDependencyToDepth = Record<RowId, number>;
/** @deprecated */
export type CardIdToDependencyDepth = Record<CardId, number>;

/** Used for dependencies and such to redirect text to an id. */
export type RawText = Brand<string, "RawText">;
