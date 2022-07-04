import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { CardId, DeckId, ScheduleData } from "flashcards/flashcards/types";
import { saveStore } from "flashcards/sync/initialize";
import { UserId, Username } from "flashcards/user/types";
import { UserSettings } from "flashcards/user/userSettings.types";
import { makeObservable, observable, reaction } from "mobx";
import { applyFunctionToEachObjectValue } from "modules/applyFunctionToEachObjectValue";
import { Seconds, Timestamp } from "modules/time";

class Store {
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
      secondsSpent: Seconds;
      timestamp: Timestamp;
    }
  > = {};
  lastSynced?: Timestamp;
  needsSyncing = new Set<string>();
  /** Separate from settings since user may not wish to sync this */
  @observable volume: boolean = true;
  constructor() {
    makeObservable(this);
    reaction(() => [Object.keys(this.decks), this.deckOrder], saveStore);
  }

  toJSON() {
    return {
      decks: applyFunctionToEachObjectValue(this.decks, (deck) =>
        deck.toJSON()
      ),
    };
  }
}

export const store = new Store();
