import { getUserFromCookie } from "flashcards/app/functions/cookie";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { CardId, DeckId, ScheduleData } from "flashcards/flashcards/types";
import { UserId, Username } from "flashcards/user/types";
import { UserSettings } from "flashcards/user/userSettings.types";
import { syncedValue } from "flashcards/userData/userDataValue";
import { makeAutoObservable } from "mobx";
import { Seconds, Timestamp } from "modules/time";

export type SessionLogData = {
  deckId?: DeckId;
  secondsSpent: Seconds;
  timestamp: Timestamp;
};

export class Store {
  user: {
    userId: UserId;
    username: Username;
  } | null = getUserFromCookie();
  userSettings: UserSettings = syncedValue({
    key: "userSettings",
    defaultValue: {},
  });
  decks: Record<DeckId, Deck> = {};
  deckOrder: DeckId[] = syncedValue({
    key: "deckOrder",
    defaultValue: [],
  });
  schedule: Record<CardId, ScheduleData> = {};
  sessionLog: Record<string, SessionLogData> = {};
  constructor() {
    makeAutoObservable(this);
    // reaction(() => [Object.keys(this.decks), this.deckOrder], saveStore);
  }
}

export const store = new Store();
