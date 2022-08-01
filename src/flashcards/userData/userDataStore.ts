import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { Row } from "flashcards/flashcards/actions/row/row";
import { DeckId } from "flashcards/flashcards/types";
import { Store } from "flashcards/store";
import {
  UserDataValue,
  UserDataValueData,
} from "flashcards/userData/userDataValue";
import { action, makeObservable, observable, observe, toJS } from "mobx";
import { getFromLocalStorage } from "modules/localStorage";
import { Timestamp } from "modules/time";

export type SyncedUserDataStore = {
  userId: string;
  lastSynced: Timestamp;
  values: {
    [keys: string]: UserDataValueData;
  };
};

/**
 * Key-value store that makes syncing and local storage easier
 * by wrapping each value in a {@link UserDataValue}.
 */
export class UserDataStore {
  /** This value always comes from the server */
  lastSynced: Timestamp = getFromLocalStorage("lastSynced") || 0;
  userId?: string;
  values: Map<string, UserDataValue> = new Map();
  shouldSync = true;

  constructor() {
    makeObservable(this, {
      values: observable.shallow,
    });
  }

  set(
    input: UserDataValueData & {
      isInitializing?: boolean;
      obj?: Deck | Row;
    },
  ): UserDataValue["value"] {
    if (this.values.has(input.key)) {
      Object.assign(this.values.get(input.key)!.value, input.value);
    } else {
      this.values.set(
        input.key,
        new UserDataValue(
          input.type,
          input.key,
          input.value,
          input.needsSyncing,
          input.isInitializing,
          input.obj,
        ),
      );
    }

    return this.values.get(input.key)!.value;
  }

  // Todo: only reacts to additions
  derivedMap = <T extends Map<any, any>>(
    predicate: (value: UserDataValue) => boolean,
  ): T => {
    const map = observable.map(new Map(), { deep: false });

    for (let value of this.values.values()) {
      updateMap(value);
    }

    /** React to changes in the key-value store */
    observe(this.values, (change) =>
      action(() => {
        if (change.type === "add") {
          if (predicate(change.newValue)) {
            // updateMap(change.newValue);
          }
        }
      }),
    );

    function updateMap(value: UserDataValue) {
      let obj = value.obj;
      if (!obj) {
        if (value.type === "deck") {
          obj = new Deck(value.key as DeckId, value.value);
        }
        value.obj = obj;
      }
      map.set(value.key, obj);
    }

    return map as unknown as T;
  };
}

export const userDataStore = new UserDataStore();

// @ts-ignore
window["userDataStore"] = userDataStore;
// @ts-ignore
window["userDataStoreJs"] = () => toJS(userDataStore);

/** Must be called before makeAutoObservable */
export const makeSynced = <T extends Store | Deck | Row>(obj: T) => {
  let keys: keyof T[];

  if (obj instanceof Store) {
    // obj.userSettings = userDataStore.
    // obj.deckOrder = userDataStore.
    obj.decks = userDataStore.derivedMap((value) => value.key === "deck");
    obj.schedule = userDataStore.derivedMap(
      (value) => value.key === "schedule",
    );
    obj.sessionLog = userDataStore.derivedMap(
      (value) => value.key === "sessionLog",
    );
  } else if (obj instanceof Deck) {
    obj.rows = userDataStore.derivedMap(
      (value) => value.type === "row",
      // TODO: deckid
    );
    obj.settings = userDataStore.set({
      type: "deck",
      key: obj.deckId,
      value: obj.settings,
      obj,
    });
  } else if (obj instanceof Row) {
  }
};
