import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { nextCard } from "flashcards/flashcards/actions/session/nextCard";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { syncIfNecessary } from "flashcards/flashcards/actions/userData/sync";
import { action } from "mobx";
import { createCards } from "flashcards/flashcards/actions/createCards";

export const initializeSession = action((deck: Deck) => {
  const session = getSession();
  session.reset();
  session.allowedDecks = [deck];
  createCards();
  nextCard();
  void syncIfNecessary();
});

/* The constructor of the old Session file */
// constructor(deck: Deck, init) {
//     session.reset();
//     session.deck = deck;
//     /* Used to save the progress of a session that was prematurely closed */
//     if (init?.cards) {
//       Object.assign(session. init);
//       session.cards = session.cards
//         .map(({ id, history }) => {
//           if (doesCardExist(id)) {
//             return new CardInSession({
//               id,
//               history,
//               session: session.
//             });
//           } else {
//             console.warn("No id " + id);
//             return null;
//           }
//         })
//         .filter(Boolean);
//       /**
//        * TODO:
//        * Þetta virkar ekki án timeout þar sem Deck.session er ekki búið að initializeras fyrst
//        */
//       setTimeout(() => {
//         void session.sessionDone({ isInitializing: true });
//       }, 10);
//     }
//   }
