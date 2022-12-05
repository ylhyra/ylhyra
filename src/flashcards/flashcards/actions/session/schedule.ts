import { SyncedData } from "flashcards/userData/syncedData";
import { Timestamp, Days, Seconds } from "modules/time";
import { makeAutoObservable } from "mobx";
import { CardId, DeckId } from "flashcards/flashcards/types";

// todo: move to cardSchedule.ts?
export class ScheduleData extends SyncedData {
  cardId!: CardId;
  dueAt!: Timestamp;
  lastIntervalInDays?: Days;
  score?: number;
  lastSeen?: Timestamp;
  sessionsSeen?: number;

  /* Í VINNSLU */
  lastBadTimestamp?: Timestamp;
  numberOfBadSessions?: number;

  constructor(data: Omit<ScheduleData, keyof SyncedData>) {
    super({ type: "schedule", key: data.cardId, ...data });
    makeAutoObservable(this);
  }
}

export class SessionLogData extends SyncedData {
  deckId?: DeckId;
  secondsSpent!: Seconds;
  timestamp!: Timestamp;

  constructor(data: Omit<SessionLogData, Exclude<keyof SyncedData, "key">>) {
    super({ type: "sessionLog", ...data });
  }
}
