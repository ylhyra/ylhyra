import { isDev } from "modules/isDev";
import { log } from "modules/log";
import axios from "ylhyra/app/app/axios";
import { getFromLocalStorage } from "ylhyra/app/app/functions/localStorage";
import store from "ylhyra/app/app/store";
import Deck from "ylhyra/vocabulary/app/actions/deck";
import { sync } from "ylhyra/vocabulary/app/actions/userData/sync";
import { UserData } from "ylhyra/vocabulary/app/actions/userData/userData";
import { getScheduleFromUserData } from "ylhyra/vocabulary/app/actions/userData/userDataSchedule";
import { clearOverview } from "ylhyra/vocabulary/app/elements/OverviewScreen/actions";
import { getDeckName } from "ylhyra/vocabulary/compiler/parseVocabularyFile/functions";

export const initializeVocabulary = async () => {
  log("Downloading database");
  const database = (
    await axios.get(
      `/api/vocabulary/vocabulary_database${getDeckName()}.json?v=${getVocabularyBuildId()}`
    )
  ).data;
  const user_data: UserData = await sync({ isInitializing: true });
  const schedule = getScheduleFromUserData(user_data);
  const session = getFromLocalStorage("vocabulary-session");

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

let vocabularyBuildId: string;
/**
 * Used to prevent caching of out-dated vocabulary files
 */
const getVocabularyBuildId = () => {
  if (isDev) return Math.random();
  if (vocabularyBuildId) return vocabularyBuildId;
  vocabularyBuildId =
    document
      .querySelector('meta[name="vocabulary_id"]')
      ?.getAttribute("content") || "";
  return vocabularyBuildId;
};
