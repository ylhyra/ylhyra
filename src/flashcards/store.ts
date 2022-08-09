import { userDataStore } from "flashcards/userData/userDataStore";
import { getUserFromCookie } from "flashcards/app/functions/cookie";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { CardId, DeckId, ScheduleData } from "flashcards/flashcards/types";
import { UserId, Username } from "flashcards/user/types";
import { UserSettings } from "flashcards/user/userSettings.types";
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
  userSettings: UserSettings = {};
  decks: Map<DeckId, Deck> = new Map();
  // deckOrder: DeckId[] = [];
  schedule: Map<CardId, ScheduleData> = new Map();
  sessionLog: Map<string, SessionLogData> = new Map();
  constructor() {
    this.userSettings = userDataStore.set({
      type: "userSettings",
      key: "userSettings",
      value: {},
    }).value;
    makeAutoObservable(this);
  }
}

export const store = new Store();

// @ts-ignore
window["store"] = store;
