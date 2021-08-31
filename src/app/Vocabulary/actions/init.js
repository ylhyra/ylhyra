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
import { getDeckName } from "maker/VocabularyMaker/functions";

export const InitializeVocabulary = async () => {
  let DECK = getDeckName(); /* Only used for testing */

  const now = new Date().getTime();
  let database = getFromLocalStorage("vocabulary-database");
  let should_update = false;
  if (
    database &&
    (!getBuildId() ||
      getBuildId() !== getFromLocalStorage("vocabulary-build-id"))
  ) {
    should_update = true;
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

  let { user_data, schedule } = (await sync()) || {};

  let session = getFromLocalStorage("vocabulary-session");
  // if (getFromLocalStorage("vocabulary-session-remaining")) {
  //   session_log.push({
  //     //       seconds_spent
  //     // timestamp
  //   });
  // }

  const deck = new Deck({
    database,
    schedule,
    session,
    user_data,
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
      .querySelector('meta[name="vocabulary_id"]')
      ?.getAttribute("content") || "";
  return build_id;
};
