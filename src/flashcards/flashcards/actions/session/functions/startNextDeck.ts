import { initializeSession } from "flashcards/flashcards/actions/session/initialize";
import { store } from "flashcards/store";
import { exitVocabularyScreen } from "flashcards/flashcards/actions/functions";

export function startNextDeck() {
  const currentDeck = store.session.chosenDeck!;

  const nextDeck = [...store.decks.values()]
    // Only show decks where there are some overdue or new cards
    .filter(
      (deck) =>
        !deck.settings.deleted &&
        deck !== currentDeck &&
        deck.getSetting("includeInAutomaticDeckSwitching") &&
        deck.hasCardsToShow,
    )
    .sort((a, b) => a.lastSession - b.lastSession)[0];

  // currentDeck = store.session.chosenDeck;
  // console.log(
  //   [...store.decks.values()]
  //     // Only show decks where there are some overdue or new cards
  //     .filter(
  //       (deck) =>
  //         !deck.settings.deleted &&
  //         deck !== currentDeck &&
  //         deck.getSetting("includeInAutomaticDeckSwitching") &&
  //         deck.hasCardsToShow,
  //     )
  //     .sort((a, b) => a.lastSession - b.lastSession),
  // );

  if (!nextDeck || !currentDeck.hasCardsToShow) {
    store.session.reset();
    void exitVocabularyScreen();
    console.error("No next deck ??");
  } else {
    /** TODO!! Vantar að skipta um URL */
    initializeSession(nextDeck || currentDeck);
  }
}

// @ts-ignore
window.startNextDeck = startNextDeck;
