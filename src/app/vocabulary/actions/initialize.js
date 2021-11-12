import { getDeckName } from "maker/vocabulary_maker/compile/functions";
import { getFromLocalStorage } from "app/app/functions/localStorage";
import { log } from "app/app/functions/log";
import { sync } from "app/vocabulary/actions/userData/sync";
import Deck from "app/vocabulary/actions/deck";
import axios from "app/app/axios";
import store from "app/app/store";
import { calculateOverview } from "app/vocabulary/elements/OverviewScreen/actions";
import { isDev } from "app/app/functions/isDev";
import { getScheduleFromUserData } from "app/vocabulary/actions/userData/userDataSchedule";

export const InitializeVocabulary = async () => {
  log("Downloading database");
  const database = (
    await axios.get(
      `/api/vocabulary/vocabulary_database${getDeckName()}.json?v=${getBuildId()}`
    )
  ).data;
  /** @type UserData */
  const user_data = await sync({ isInitializing: true });
  const schedule = getScheduleFromUserData(user_data);
  const session = getFromLocalStorage("vocabulary-session");

  // TODO: log
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
  calculateOverview();
};

let build_id;
const getBuildId = () => {
  if (isDev) return Math.random();
  if (build_id) return build_id;
  build_id =
    document
      .querySelector('meta[name="vocabulary_id"]')
      ?.getAttribute("content") || "";
  return build_id;
};
