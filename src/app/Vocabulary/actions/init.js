import store from "app/App/store";
import error from "app/App/Error";
import axios from "app/App/axios";
import Deck from "./deck";
import {
  saveInLocalStorage,
  getFromLocalStorage,
} from "app/App/functions/localStorage";
import { getUserFromCookie } from "app/User/actions";
import { hour, day } from "app/App/functions/time";

export const InitializeVocabulary = async () => {
  const now = new Date().getTime();
  let database = getFromLocalStorage("vocabulary-database");
  let should_update = false;
  if (
    database &&
    getFromLocalStorage("vocabulary-database-last-updated") <
      now - (process.env.NODE_ENV === "production" ? 3 * day : 0)
  ) {
    const database_last_updated = (
      await axios.get(`/api/vocabulary/database_last_updated`)
    ).data;
    if (
      parseInt(database_last_updated) >
      getFromLocalStorage("vocabulary-database-last-updated")
    ) {
      should_update = true;
      console.log("Reloading vocabulary database as it has been updated");
    }
  }
  if (!database || should_update) {
    console.log("Downloading database");
    database = (await axios.get(`/api/vocabulary/vocabulary_database.json`))
      .data;
    saveInLocalStorage("vocabulary-database", database);
    saveInLocalStorage(
      "vocabulary-database-last-updated",
      new Date().getTime()
    );
    saveInLocalStorage("vocabulary-session", null);
  }

  let schedule = getFromLocalStorage("vocabulary-schedule");
  if (!schedule) {
    schedule = {};
    if (getUserFromCookie()) {
      const r = (await axios.post(`/api/vocabulary/schedule`)).data;
      r &&
        r.forEach((i) => {
          schedule[i.card_id] = { ...i, id: i.card_id };
        });
      saveInLocalStorage("vocabulary-schedule", schedule);
      saveInLocalStorage(
        "vocabulary-schedule-last-updated",
        new Date().getTime()
      );
    }
  }

  const deck = new Deck(database, schedule);
  store.dispatch({
    type: "LOAD_DECK",
    content: deck,
  });
  /* For testing */
  window.deck = deck;
};
