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
import { sync } from "./sync";

export const InitializeVocabulary = async () => {
  let DECK = "";
  if (process.env.NODE_ENV === "development") {
    if (getUserFromCookie()?.username === "danska") {
      DECK = "_da";
    }
    if (getUserFromCookie()?.username === "spænska") {
      DECK = "_es";
    }
  }
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
  if (!database?.cards || should_update) {
    console.log("Downloading database");
    database = (
      await axios.get(
        `/api/vocabulary/vocabulary_database${DECK}.json?v=${getBuildId()}`
      )
    ).data;
    saveInLocalStorage("vocabulary-database", database);
    saveInLocalStorage("vocabulary-build-id", getBuildId());
  }

  let { schedule, session_log, easinessLevel, lastSynced } = sync();

  let session = getFromLocalStorage("vocabulary-session");

  const deck = new Deck({
    database,
    schedule,
    session,
    session_log,
    easinessLevel,
    lastSynced,
  });
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
