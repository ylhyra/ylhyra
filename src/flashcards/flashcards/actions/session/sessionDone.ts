import { createSchedule } from "flashcards/flashcards/actions/createSchedule/createSchedule";
import { exitVocabularyScreen } from "flashcards/flashcards/actions/functions";
import { clearOngoingSessionInLocalStorage } from "flashcards/flashcards/actions/session/functions/saveOngoingSessionInLocalStorage";
import { store } from "flashcards/store";
import { sync } from "flashcards/userData/sync";
import { action } from "mobx";
import { log } from "modules/log";
import { roundMsToSec, roundToInterval } from "modules/math";
import { getTime } from "modules/time";
import shortid from "shortid";
import { SessionLogData } from "flashcards/flashcards/actions/session/schedule";

/**
 * Called either when the user exits or when no time is remaining (in
 * {@link nextCard})
 */
export const sessionDone = action((options: any = {}): void => {
  const session = store.session;

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
export function saveSessionLog() {
  const session = store.session;
  if (
    session.history.cardHistory.length > 0 &&
    session.timer.getSecondsSpent() > 10
  ) {
    const timestamp = roundMsToSec(session.history.savedAt || getTime());
    const id = shortid.generate();

    new SessionLogData({
      key: id,
      secondsSpent: roundToInterval(session.timer.getSecondsSpent(), 10),
      timestamp,
    });
  } else {
    log("Not logged");
  }
}
