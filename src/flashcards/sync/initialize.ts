import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { DeckId } from "flashcards/flashcards/types";
import { store } from "flashcards/store";
import {
  FLASHCARDS_LOCALSTORAGE_PREFIX,
  userDataStore,
} from "flashcards/sync/valueStore";
import { action, observable } from "mobx";
import { getFromLocalStorage } from "modules/localStorage";
import { logDev } from "modules/log";

export let initialized = false;
export const initialize = action(() => {
  try {
    const storage: Record<string, any> = {};
    Object.keys(localStorage).forEach((key) => {
      if (!key.startsWith(FLASHCARDS_LOCALSTORAGE_PREFIX)) return;
      const { type, value } = getFromLocalStorage(key);
      userDataStore.set(
        key.slice(FLASHCARDS_LOCALSTORAGE_PREFIX.length),
        observable(value),
        type,
        true,
      );
    });

    for (const key in userDataStore.valuesByType.deck) {
      store.decks[key as DeckId] = new Deck({
        deckId: key as DeckId,
        settings: userDataStore.valuesByType.deck[key].value as DeckSettings,
      });
    }

    // for (const [key, _value] of entries(storage)) {
    //   const { type, value } = _value;
    //   if (type === "deck") {
    //     // const rows = entries(storage).filter(
    //     //   ([key, _value]) =>
    //     //     _value.type === "row" && _value.deckId === value.deckId,
    //     // );
    //     store.decks[value.id] = value;
    //     console.log(value);
    //   }
    // }

    // const savedFlashcardsStore = getFromLocalStorage("decks");
    // if (!savedFlashcardsStore) return;
    // warnIfFunctionIsSlow.wrap(() => {
    //   entries(savedFlashcardsStore.decks).forEach(([deckId, data]) => {
    //     store.decks[deckId as DeckId] = new Deck(data);
    //   });
    // }, "initializeFlashcardsStore");
    // setTimeout(() => (initialized = true), 0);

    saveStore();
  } catch (e) {
    console.error(e);
    console.error("Likely malformed flashcards store data");
  }
});

export function saveStore() {
  if (!initialized) return;
  logDev("Flashcards store saved");

  // const basicValues: (keyof Store)[] = [
  //   "user",
  //   "userSettings",
  //   "deckOrder",
  //   "lastSynced",
  //   "volume",
  // ];
  // const records: (keyof Store)[] = [
  //   "decks",
  //   "schedule",
  //   "sessionLog" /*"rows"*/,
  // ];
  //
  // let toSave = toJS({
  //   user: store.user,
  //   userSettings: store.userSettings,
  //   decks: applyFunctionToEachObjectValue(store.decks, (deck) => deck.toJSON()),
  //   deckOrder: store.deckOrder,
  //   schedule: store.schedule,
  //   sessionLog: store.sessionLog,
  //   lastSynced: store.lastSynced,
  //   needsSyncing: store.needsSyncing,
  // });
  //
  // saveInLocalStorage("decks", toSave);
}
