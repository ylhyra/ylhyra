import axios from "ylhyra/app/app/axios";
import { isDev } from "ylhyra/app/app/functions/isDev";
import { getFromLocalStorage } from "ylhyra/app/app/functions/localStorage";
import { log } from "ylhyra/app/app/functions/log";
import store from "ylhyra/app/app/store";
import Deck from "ylhyra/app/vocabulary/actions/deck";
import { sync } from "ylhyra/app/vocabulary/actions/userData/sync";
import { getScheduleFromUserData } from "ylhyra/app/vocabulary/actions/userData/userDataSchedule";
import { clearOverview } from "ylhyra/app/vocabulary/elements/OverviewScreen/actions";
import { getDeckName } from "ylhyra/maker/vocabulary_maker/compile/functions";

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
  clearOverview();
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
