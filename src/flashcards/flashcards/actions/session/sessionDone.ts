import { createSchedule } from "flashcards/flashcards/actions/createSchedule/createSchedule";
import { exitVocabularyScreen } from "flashcards/flashcards/actions/functions";
import { clearOngoingSessionInLocalStorage } from "flashcards/flashcards/actions/session/functions/saveOngoingSessionInLocalStorage";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { sync } from "flashcards/flashcards/actions/userData/sync";
import { setUserDataKey } from "flashcards/flashcards/actions/userData/userData";
import { SESSION_PREFIX } from "flashcards/flashcards/actions/userData/userDataSessions";
import { action } from "mobx";
import { log } from "modules/log";
import { roundMsToSec, roundToInterval } from "modules/math";
import { getTime } from "modules/time";

/**
 * Called either when the user exits or when
 * no time is remaining (in {@link nextCard})
 */
export const sessionDone = action((options: any = {}): void => {
  const session = getSession();

  createSchedule();
  clearOngoingSessionInLocalStorage();
  if (!options.isInitializing) {
    void exitVocabularyScreen();
  }
  saveSessionLog();
  void sync();
  // clearOverview();
  session.reset();

  // if (process.env.NODE_ENV === "development" && getDeckName()) {
  //   goToUrl("/vocabulary/play");
  //   initializeSession();
  // }
});

/** Records how much time the user spent so we can show an activity graph. */
export const saveSessionLog = () => {
  const session = getSession();
  if (
    session.history.cardHistory.length > 0 &&
    session.timer.getSecondsSpent() > 10
  ) {
    const timestamp = roundMsToSec(session.history.savedAt || getTime());
    const timestampInSeconds = Math.round(timestamp / 1000);
    setUserDataKey(
      SESSION_PREFIX + timestampInSeconds.toString(),
      {
        seconds_spent: roundToInterval(session.timer.getSecondsSpent(), 10),
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
