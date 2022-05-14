import { getSession } from "flashcards/flashcards/actions/session/session";
import { saveInLocalStorage } from "modules/localStorage";
import { getTime } from "modules/time";

export const saveOngoingSessionInLocalStorage = () => {
  const session = getSession();

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
};

export const clearOngoingSessionInLocalStorage = () => {
  saveInLocalStorage("vocabulary-session", null);
};
