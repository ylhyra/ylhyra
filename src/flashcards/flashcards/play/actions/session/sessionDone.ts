import { createSchedule } from "flashcards/flashcards/play/actions/createSchedule";
import { exitVocabularyScreen } from "flashcards/flashcards/play/actions/functions";
import { clearInLocalStorage } from "flashcards/flashcards/play/actions/session/sessionSaveLocalStorage";
import { getSession } from "flashcards/flashcards/play/actions/session/sessionStore";
import { sync } from "flashcards/flashcards/play/actions/userData/sync";
import { setUserData } from "flashcards/flashcards/play/actions/userData/userData";
import { SESSION_PREFIX } from "flashcards/flashcards/play/actions/userData/userDataSessions";
import { log } from "modules/log";
import { roundMsToSec, roundToInterval } from "modules/math";
import { getTime } from "modules/time";

export const sessionDone = async (options: any = {}) => {
  const session = getSession();

  session.done = true;
  createSchedule();
  clearInLocalStorage();
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
