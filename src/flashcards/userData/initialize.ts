import { action } from "mobx";
import { FLASHCARDS_LOCALSTORAGE_PREFIX } from "flashcards/userData/localStorage";
import { sync } from "flashcards/userData/sync";
import { userDataStore } from "flashcards/userData/userDataStore";
import { SyncedData, syncedDataTypesToObjects } from "./userDataValue";
import { getFromLocalStorage } from "modules/localStorage";

export const initialize = action(() => {
  try {
    let values: SyncedData[] = [];

    /** Load data from localStorage into {@link userDataStore} */
    Object.keys(localStorage).forEach((key) => {
      if (!key.startsWith(FLASHCARDS_LOCALSTORAGE_PREFIX)) return null;
      const value = getFromLocalStorage<SyncedData>(key);
      if (!value) return;
      initializeObject(value);

      // values.push(
      //   userDataStore.set({
      //     ...value,
      //     isInitializing: true,
      //     key: key.slice(FLASHCARDS_LOCALSTORAGE_PREFIX.length),
      //   }),
      // );
    });

    // TODO UserDataStore.lastSynced

    // applyChangesToMainStore(values);

    void sync();
  } catch (e) {
    console.error(e);
    console.error("Likely malformed flashcards store data");
  }
});

export function initializeObject(input: SyncedData) {
  // @ts-ignore
  new syncedDataTypesToObjects[input.type](input);
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
