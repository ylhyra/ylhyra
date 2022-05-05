import { Row, RowId } from "flashcards/flashcards/types/row";
import { DeckSettings } from "flashcards/flashcards/types/deckSettings";
import { Days, Timestamp } from "modules/time";
import { Brand } from "ts-brand";
import { Sentence } from "flashcards/flashcards/compile/compile";

export type RowsObject = Record<RowId, Row>;

export type DeckId = string;
export type UnprocessedDeck = {
  id: DeckId;
  rows: RowsObject;
  settings: DeckSettings;
};
export type UnprocessedDecksObject = Record<DeckId, UnprocessedDeck>;

export type DirectionSettings = "BOTH" | "FRONT_TO_BACK" | "BACK_TO_FRONT";
export type Direction = "FRONT_TO_BACK" | "BACK_TO_FRONT";

export type ProcessedDecksObject = Record<DeckId, DeckProcessed>;
export type DeckProcessed = {
  // id: DeckId;
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
  dependencies?: Record<TermId, Sentence[]>;
  alternativeIds?: Record<TermId, Sentence[]>;
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
 * TermId and direction is encoded in CardId
 * @see createCardId
 */
type CardId = Brand<string, "CardId">;
type CardIds = Array<CardId>;
type TermId = Brand<string, "TermId">;
type TermIds = Array<TermId>;

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
