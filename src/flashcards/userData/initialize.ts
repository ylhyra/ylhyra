import { applyChangesToMainStore } from "flashcards/userData/applyChangesToMainStore";
import { getUserDataValueFromLocalStorage } from "flashcards/userData/localStorage";
import { sync } from "flashcards/userData/sync";
import { userDataStore } from "flashcards/userData/userDataStore";
import { action } from "mobx";

// export let initialized = false;
export const initialize = action(() => {
  try {
    /** Load data from localStorage into {@link userDataStore} */
    Object.keys(localStorage).forEach((_key) => {
      const values = getUserDataValueFromLocalStorage(_key);
      if (!values) return;
      userDataStore.set({ ...values, isInitializingFromLocalStorage: true });
    });

    // TODO UserDataStore.lastSynced

    applyChangesToMainStore();
    void sync();
  } catch (e) {
    console.error(e);
    console.error("Likely malformed flashcards store data");
  }
});
