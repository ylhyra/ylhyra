import store from "app/App/store";
import error from "app/App/Error";
import axios from "app/App/axios";
import Deck from "./deck";
import {
  saveInLocalStorage,
  getFromLocalStorage,
} from "app/App/functions/localStorage";
import { getUserFromCookie, isUserLoggedIn } from "app/User/actions";
import { hour, day } from "app/App/functions/time";
import { InitializeUser } from "app/User/actions";

export const InitializeVocabulary = async () => {
  const DECK =
    process.env.NODE_ENV === "development" && getUserFromCookie() !== null
      ? getUserFromCookie().username === "danska"
        ? "_da"
        : "_es"
      : ""; // TMP
  const now = new Date().getTime();
  let database = getFromLocalStorage("vocabulary-database");
  let should_update = false;
  if (database) {
    if (
      !getBuildId() ||
      getBuildId() !== getFromLocalStorage("vocabulary-build-id")
    ) {
      should_update = true;
    }
  }
  if (!database || should_update || !database.cards) {
    console.log("Downloading database");
    database = (
      await axios.get(
        `/api/vocabulary/vocabulary_database${DECK}.json?v=${getBuildId()}`
      )
    ).data;
    saveInLocalStorage("vocabulary-database", database);
    saveInLocalStorage(
      "vocabulary-database-last-updated",
      new Date().getTime()
    );
    saveInLocalStorage("vocabulary-build-id", getBuildId());
  }

  let schedule = getFromLocalStorage("vocabulary-schedule") || {};
  let easinessLevel = getFromLocalStorage("vocabulary-easiness-level") || 0;

  if (isUserLoggedIn()) {
    /* TODO: Selective sync */
    const r = (await axios.post(`/api/vocabulary/schedule`)).data;
    if (r) {
      r.forEach((i) => {
        /* TODO: Hvað ef server er undan á? */
        if (schedule[i.card_id]?.needsSyncing) return;
        schedule[i.card_id] = { ...i, id: i.card_id };
      });
      saveInLocalStorage("vocabulary-schedule", schedule);
      saveInLocalStorage(
        "vocabulary-schedule-last-updated",
        new Date().getTime()
      );
      console.log("Schedule downloaded");
    }
  }

  let session = getFromLocalStorage("vocabulary-session");

  const deck = new Deck({ database, schedule, session, easinessLevel });
  store.dispatch({
    type: "LOAD_DECK",
    content: deck,
  });
};

let build_id;
const getBuildId = () => {
  if (build_id) return build_id || "";
  build_id =
    document
      .querySelector('link[href^="/app/main.css"]')
      ?.getAttribute("href")
      .match(/v=(.+)/)?.[1] || "";
  return build_id;
};
