import { getSession } from "flashcards/flashcards/sessionStore";
import { saveInLocalStorage } from "modules/localStorage";
import { getTime } from "modules/time";

export const saveOngoingSessionInLocalStorage = () => {
  const session = getSession();

  if (!session.cards.some((i) => i.hasBeenSeenInSession())) {
    return;
  }
  let toSave = session.cards.map((card) => ({
    id: card.cardId,
    history: card.history,
  }));
  saveInLocalStorage("vocabulary-session", {
    remainingTime: session.remainingTime,
    savedAt: getTime(),
    cards: toSave,
  });
  session.savedAt = getTime();
};

export const clearOngoingSessionInLocalStorage = () => {
  saveInLocalStorage("vocabulary-session", null);
};
