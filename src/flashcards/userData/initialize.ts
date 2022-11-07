import { action, toJS } from "mobx";
import { CardId, DeckId } from "flashcards/flashcards/types";
import { store } from "flashcards/store";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { Row } from "flashcards/flashcards/actions/row/row";
import { getUserDataValueFromLocalStorage } from "flashcards/userData/localStorage";
import { sync } from "flashcards/userData/sync";
import { userDataStore } from "flashcards/userData/userDataStore";
import { UserDataValue } from "./userDataValue";

export const initialize = action(() => {
  try {
    let values: UserDataValue[] = [];

    /** Load data from localStorage into {@link userDataStore} */
    Object.keys(localStorage).forEach((_key) => {
      const value = getUserDataValueFromLocalStorage(_key);
      if (!value) return;
      values.push(userDataStore.set({ ...value, isInitializing: true }));
    });

    // TODO UserDataStore.lastSynced

    applyChangesToMainStore(values);

    void sync();
  } catch (e) {
    console.error(e);
    console.error("Likely malformed flashcards store data");
  }
});

export function applyChangesToMainStore(values: UserDataValue[]) {
  /** First decks must be created, since rows depend on them */
  for (const value of values) {
    if (value.type === "deck") {
      new Deck(value.key as DeckId, value.value);
    }
  }

  for (const value of values) {
    switch (value.type) {
      case "row":
        const deck = store.decks.get(value.value.deckId);
        if (deck) {
          new Row(deck, value.value);
        } else {
          console.log(value.value.deckId);
          console.log(toJS(store.decks));

          throw new Error("Deck not initialized for row!");
        }
        break;
      case "schedule":
        store.schedule.set(value.key as CardId, value.value);
        break;
      case "sessionLog":
        store.sessionLog.set(value.key, value.value);
        break;
      case "userSettings":
        store.userSettings = value.value;
        break;
      // case "deckOrder":
      //   store.deckOrder = value.value;
      //   break;
    }
  }
}
