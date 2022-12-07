import { action } from "mobx";
import { FLASHCARDS_LOCALSTORAGE_PREFIX } from "flashcards/userData/localStorage";
import { sync } from "flashcards/userData/sync";
import { userDataStore } from "flashcards/userData/userDataStore";
import { SyncedData } from "flashcards/userData/syncedData";
import { getFromLocalStorage } from "modules/localStorage";
import { Row } from "flashcards/flashcards/actions/row/row";
import {
  ScheduleData,
  SessionLogData,
} from "flashcards/flashcards/actions/session/schedule";
import { Deck } from "flashcards/flashcards/actions/deck/deck";

export const initialize = action(() => {
  try {
    /** Load data from localStorage into {@link userDataStore} */
    Object.keys(localStorage).forEach((key) => {
      if (!key.startsWith(FLASHCARDS_LOCALSTORAGE_PREFIX)) return null;
      const data = getFromLocalStorage<SyncedData>(key);
      if (!data) return;
      initializeObject(data);
    });

    // TODO UserDataStore.lastSynced

    void sync();
  } catch (e) {
    console.error(e);
    console.error("Likely malformed flashcards store data");
  }
});

export function initializeObject(input: SyncedData) {
  if (input.key in userDataStore.values) {
    // Todo: Reaction is still active
    Object.assign(userDataStore.values[input.key], input);
  } else {
    /**
     * The types of data which are stored as {@link SyncedData} and the values
     * they represent.
     */
    const syncedDataTypesToObjects = {
      deck: Deck,
      row: Row,
      schedule: ScheduleData,
      sessionLog: SessionLogData,
      // userSettings: UserSettings,
    };

    // @ts-ignore
    const obj = new (syncedDataTypesToObjects[input.type](input))();
    userDataStore.save(obj);
  }
}

// export function applyChangesToMainStore(values: SyncedData[]) {
//   /** First decks must be created, since rows depend on them */
//   for (const value of values) {
//     if (value.type === "deck") {
//       new Deck(value.key as DeckId, value.value);
//     }
//   }
//
//   for (const value of values) {
//     switch (value.type) {
//       case "row":
//         const deck = store.decks.get(value.value.deckId);
//         if (deck) {
//           new Row(deck, value.value);
//         } else {
//           throw new Error("Deck not initialized for row!");
//         }
//         break;
//       case "schedule":
//         store.schedule.set(value.key as CardId, value.value);
//         break;
//       case "sessionLog":
//         store.sessionLog.set(value.key, value.value);
//         break;
//       case "userSettings":
//         store.userSettings = value.value;
//         break;
//       // case "deckOrder":
//       //   store.deckOrder = value.value;
//       //   break;
//     }
//   }
// }
