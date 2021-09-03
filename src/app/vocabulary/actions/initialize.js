import store from "app/app/store";
import axios from "app/app/axios";
import Deck from "app/vocabulary/actions/deck";
import {
  saveInLocalStorage,
  getFromLocalStorage,
} from "app/app/functions/localStorage";
import { sync } from "app/vocabulary/actions/sync";
import { getDeckName } from "maker/vocabulary_maker/compile";

export const InitializeVocabulary = async () => {
  console.warn("init");
  let DECK = getDeckName(); /* Only used for testing */
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
