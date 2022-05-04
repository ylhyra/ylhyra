import { getSession } from "flashcards/flashcards/play/actions/session/sessionStore";
import { saveInLocalStorage } from "modules/localStorage";
import { getTime } from "modules/time";

export const saveSessionInLocalStorage = () => {
  const session = getSession();

  if (!session.cards.some((i) => i.hasBeenSeenInSession())) {
    return;
  }
  let toSave = session.cards.map((card) => ({
    id: card.getId(),
    history: card.history,
  }));
  saveInLocalStorage("vocabulary-session", {
    remainingTime: session.remainingTime,
    savedAt: getTime(),
    cards: toSave,
  });
  session.savedAt = getTime();
};

export const clearInLocalStorage = () => {
  saveInLocalStorage("vocabulary-session", null);
};
