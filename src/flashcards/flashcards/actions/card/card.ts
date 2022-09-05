import { getDirectionFromCardId } from "flashcards/flashcards/actions/row/ids";
import { Row } from "flashcards/flashcards/actions/row/row";
import {
  CardId,
  ScheduleData,
  Score,
  Direction,
} from "flashcards/flashcards/types";
import { store } from "flashcards/store";
import { Days, Timestamp } from "modules/time";
import { Html } from "../../../../inflection/tables/types";
import { formatVocabularyEntry } from "../format/format";

export class Card {
  constructor(public row: Row, public cardId: CardId) {}

  get data() {
    return this.row.data;
  }

  get rowId() {
    return this.row.rowId;
  }

  get isIgnored() {
    return this.data.deleted;
  }

  get deck() {
    return this.row.deck;
  }

  get direction(): Direction {
    return getDirectionFromCardId(this.cardId);
  }

  /**
   * Checks if two cards are the same card. (Used since Card === Card doesn't
   * work if they are the same card just initialized at a different time,
   * although that is currently never possible)
   */
  is(card: Card) {
    return this.cardId === card.cardId;
  }

  /** Checks if this card is in an array of cards */
  isIn(cards: Card[]) {
    return cards.some((card) => card.is(this));
  }

  get schedule(): ScheduleData | undefined {
    return store.schedule.get(this.cardId);
  }

  get dueAt(): Timestamp | undefined {
    return this.schedule?.dueAt;
  }

  /** @see Score */
  get score(): Score | undefined {
    return this.schedule?.score;
  }

  get sessionsSeen(): number {
    return this.schedule?.sessionsSeen || 0;
  }

  get numberOfBadSessions(): number {
    return this.schedule?.numberOfBadSessions || 0;
  }

  get lastIntervalInDays(): Days | undefined {
    return this.schedule?.lastIntervalInDays;
  }

  get lastSeen(): Timestamp | undefined {
    return this.schedule?.lastSeen;
  }

  get frontFormatted(): Html {
    return formatVocabularyEntry(this.data.front);
  }

  get backFormatted(): Html {
    return formatVocabularyEntry(this.data.back);
  }

  get hasSound() {
    return (
      (this.row.getSetting("frontSideSpeechSynthesis") &&
        this.row.getSetting("frontSideLanguage")) ||
      (this.row.getSetting("backSideSpeechSynthesis") &&
        this.row.getSetting("backSideLanguage"))
    );
  }
}
