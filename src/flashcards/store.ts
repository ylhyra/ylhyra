import { getUserFromCookie } from "flashcards/app/functions/cookie";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { CardId, DeckId } from "flashcards/flashcards/types";
import { UserCookie } from "flashcards/user/types";
import { UserSettings } from "flashcards/user/userSettings.types";
import { makeAutoObservable } from "mobx";
import { Session } from "flashcards/flashcards/actions/session/session";
import {
  ScheduleData,
  SessionLogData,
} from "flashcards/flashcards/actions/session/schedule";

export class Store {
  user: UserCookie = getUserFromCookie();
  userSettings: UserSettings = new UserSettings();
  decks: Map<DeckId, Deck> = new Map();
  schedule: Map<CardId, ScheduleData> = new Map();
  sessionLog: Map<string, SessionLogData> = new Map();
  session = new Session();
  constructor() {
    makeAutoObservable(this);
  }
}

export let store = new Store();
export function clearStore() {
  store = new Store();
}

// @ts-ignore
window["store"] = store;
