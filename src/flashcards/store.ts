import { getUserFromCookie } from "flashcards/app/functions/cookie";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { CardId, DeckId, ScheduleData } from "flashcards/flashcards/types";
import { UserId, Username } from "flashcards/user/types";
import { UserSettings } from "flashcards/user/userSettings.types";
import { makeAutoObservable } from "mobx";
import { Seconds, Timestamp } from "modules/time";

console.log(getUserFromCookie());
export class Store {
  user: {
    userId: UserId;
    username: Username;
  } | null = getUserFromCookie();
  userSettings: UserSettings = {};
  decks: Record<DeckId, Deck> = {};
  deckOrder: DeckId[] = [];
  schedule: Record<CardId, ScheduleData> = {};
  sessionLog: Record<
    string,
    {
      deckId?: DeckId;
      secondsSpent: Seconds;
      timestamp: Timestamp;
    }
  > = {};
  /** Separate from settings since user may not wish to sync this */
  volume: boolean = true;
  constructor() {
    makeAutoObservable(this);
    // reaction(() => [Object.keys(this.decks), this.deckOrder], saveStore);
  }
}

export const store = new Store();
