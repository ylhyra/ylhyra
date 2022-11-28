import { getUserFromCookie } from "flashcards/app/functions/cookie";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { CardId, DeckId, ScheduleData } from "flashcards/flashcards/types";
import { UserProfile } from "flashcards/user/types";
import { UserSettings } from "flashcards/user/userSettings.types";
import { makeAutoObservable } from "mobx";
import { Seconds, Timestamp } from "modules/time";
import { Session } from "flashcards/flashcards/actions/session/session";

export type SessionLogData = {
  deckId?: DeckId;
  secondsSpent: Seconds;
  timestamp: Timestamp;
};

export class Store {
  user: UserProfile = getUserFromCookie();
  userSettings: UserSettings = {};
  decks: Map<DeckId, Deck> = new Map();
  schedule: Map<CardId, ScheduleData> = new Map();
  sessionLog: Map<string, SessionLogData> = new Map();
  session = new Session();
  constructor() {
    // this.userSettings = userDataStore.set({
    //   type: "userSettings",
    //   key: "userSettings",
    //   value: {},
    // }).value;
    makeAutoObservable(this);
  }
}

export let store = new Store();
export function clearStore() {
  store = new Store();
}

// @ts-ignore
window["store"] = store;
