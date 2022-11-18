import { saveInLocalStorage } from "modules/localStorage";
import { getTime } from "modules/time";

export function saveOngoingSessionInLocalStorage() {
  const session = store.session;

  if (!session.cards.some((i) => i.hasBeenSeenInSession())) {
    return;
  }
  let toSave = session.cards.map((card) => ({
    id: card.cardId,
    history: card.ratingHistory,
  }));
  saveInLocalStorage("vocabulary-session", {
    remainingTime: session.timer.remainingTime,
    savedAt: getTime(),
    cards: toSave,
  });
  session.history.savedAt = getTime();
}

export function clearOngoingSessionInLocalStorage() {
  saveInLocalStorage("vocabulary-session", null);
}
