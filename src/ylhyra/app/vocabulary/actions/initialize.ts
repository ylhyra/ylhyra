import { isDev } from "modules/isDev";
import { log } from "modules/log";
import axios from "ylhyra/app/app/axios";
import { getFromLocalStorage } from "ylhyra/app/app/functions/localStorage";
import store from "ylhyra/app/app/store";
import Deck from "ylhyra/app/vocabulary/actions/deck";
import { sync } from "ylhyra/app/vocabulary/actions/userData/sync";
import { UserData } from "ylhyra/app/vocabulary/actions/userData/userData";
import { getScheduleFromUserData } from "ylhyra/app/vocabulary/actions/userData/userDataSchedule";
import { clearOverview } from "ylhyra/app/vocabulary/elements/OverviewScreen/actions";
import { getDeckName } from "ylhyra/maker/vocabulary_maker/compile/functions";

export const initializeVocabulary = async () => {
  log("Downloading database");
  const database = (
    await axios.get(
      `/api/vocabulary/vocabulary_database${getDeckName()}.json?v=${getBuildId()}`
    )
  ).data;
  const user_data: UserData = await sync({ isInitializing: true });
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

let buildId: string;
const getBuildId = () => {
  if (isDev) return Math.random();
  if (buildId) return buildId;
  buildId =
    document
      .querySelector('meta[name="vocabulary_id"]')
      ?.getAttribute("content") || "";
  return buildId;
};
