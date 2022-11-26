import { DeckId } from "flashcards/flashcards/types";

export type ChapterData = {
  deckId: DeckId;
  chapterId: string;
  sortKey: number;
  deleted?: boolean;
  createdAt: string;
  updatedAt?: string;
};
