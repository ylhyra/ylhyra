import { createSchedule } from "flashcards/flashcards/actions/createSchedule";
import { exitVocabularyScreen } from "flashcards/flashcards/actions/functions";
import { clearOngoingSessionInLocalStorage } from "flashcards/flashcards/actions/session/saveOngoingSessionInLocalStorage";
import { getSession } from "flashcards/flashcards/sessionStore";
import { sync } from "flashcards/flashcards/actions/userData/sync";
import { setUserData } from "flashcards/flashcards/actions/userData/userData";
import { SESSION_PREFIX } from "flashcards/flashcards/actions/userData/userDataSessions";
import { log } from "modules/log";
import { roundMsToSec, roundToInterval } from "modules/math";
import { getTime } from "modules/time";

export const sessionDone = async (options: any = {}) => {
  const session = getSession();

  session.done = true;
  createSchedule();
  clearOngoingSessionInLocalStorage();
  if (!options.isInitializing) {
    await exitVocabularyScreen();
  }
  saveSessionLog();
  await sync();
  // clearOverview();
  session.reset();

  // if (process.env.NODE_ENV === "development" && getDeckName()) {
  //   goToUrl("/vocabulary/play");
  //   initializeSession();
  // }
};

function getSecondsSpent() {
  const session = getSession();
  return Math.round(
    (session.totalTime! - Math.max(0, session.remainingTime!)) / 1000
  );
}

export const saveSessionLog = () => {
  const session = getSession();
  if (session.cardHistory.length > 0 && getSecondsSpent() > 10) {
    const timestamp = roundMsToSec(session.savedAt || getTime());
    const timestampInSeconds = Math.round(timestamp / 1000);
    setUserData(
      SESSION_PREFIX + timestampInSeconds.toString(),
      {
        seconds_spent: roundToInterval(getSecondsSpent(), 10),
        timestamp,
      },
      "session"
    );

    // Analytics.log({
    //   type: "vocabulary",
    //   page_name: window.location.pathname,
    //   seconds: roundToInterval(session.getSecondsSpent(), 10),
    //   timestamp,
    // });
  } else {
    log("Not logged");
  }
};
