import { createCardsIfNoneAreRemaining } from "flashcards/flashcards/actions/session/functions";
import { nextCard } from "flashcards/flashcards/actions/session/nextCard";
import { syncIfNecessary } from "flashcards/flashcards/actions/userData/sync";
import { getSession } from "flashcards/flashcards/sessionStore";
import { getDeckById } from "flashcards/flashcards/flashcardsStore.functions";

export function initializeSession({ deckId }: { deckId: string | undefined }) {
  const deck = getDeckById(deckId);
  if (!deck) throw new Error();
  const session = getSession();

  session.reset();

  /* Temp */
  session.allowedDeckIds = [deckId!];
  // session.deck = compileDeck(deck);

  createCardsIfNoneAreRemaining();
  nextCard();
  void syncIfNecessary();

  // if (options.shouldReset !== false) {
  //   session.reset();
  // }
  // session.checkIfCardsRemaining();
  // session.nextCard();
  // session.loadCardInInterface();
}

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
