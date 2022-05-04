import { CardEntry } from "flashcards/flashcards/types/cardEntry";
import { DeckSettings } from "flashcards/flashcards/types/deckSettings";
import { Brand } from "ts-brand";

export type IdToUnprocessedCardEntry = Record<CardEntry["id"], CardEntry>;

export type UnprocessedDeck = {
  id: string;
  cards: IdToUnprocessedCardEntry;
  settings: DeckSettings;
};
export type IdToUnprocessedDeck = Record<
  UnprocessedDeck["id"],
  UnprocessedDeck
>;

export type DirectionSettings = "BOTH" | "FRONT_TO_BACK" | "BACK_TO_FRONT";
export type Direction = "FRONT_TO_BACK" | "BACK_TO_FRONT";

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

export type UnprocessedCardEntryId = Brand<string, "UnprocessedCardEntryId">;
export type UnprocessedCardEntryIds = Array<UnprocessedCardEntryId>;
export type RowId = UnprocessedCardEntryId;
export type RowIds = UnprocessedCardEntryIds;
export type RowIdToRowIds = { [id: RowId]: RowIds };

declare global {
  type CardId = Brand<string, "CardId">;
  type CardIds = Array<CardId>;
  type TermId = Brand<string, "TermId">;
  type TermIds = Array<TermId>;
}
