import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { CardId, DeckId, ScheduleData } from "flashcards/flashcards/types";
import { saveStore } from "flashcards/sync/initialize";
import { UserId, Username } from "flashcards/user/types";
import { UserSettings } from "flashcards/user/userSettings.types";
import { makeObservable, observable, reaction } from "mobx";
import { Seconds, Timestamp } from "modules/time";

export class Store {
  @observable user: {
    userId: UserId;
    username: Username;
  } | null = null;
  @observable userSettings: UserSettings = {};
  @observable decks: Record<DeckId, Deck> = {};
  @observable deckOrder: DeckId[] = [];
  @observable schedule: Record<CardId, ScheduleData> = {};
  @observable sessionLog: Record<
    string,
    {
      deckId?: DeckId;
      secondsSpent: Seconds;
      timestamp: Timestamp;
    }
  > = {};
  /** Separate from settings since user may not wish to sync this */
  @observable volume: boolean = true;
  constructor() {
    makeObservable(this);
    reaction(() => [Object.keys(this.decks), this.deckOrder], saveStore);
  }
}

export const store = new Store();
