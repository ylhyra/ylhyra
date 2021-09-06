import store from "app/app/store";
import { getTermsFromCards, printWord } from "app/vocabulary/actions/functions";

/**
 * @module Session
 */
export function loadCardInInterface() {
  const session = this;
  if (!session?.currentCard) return console.error("no cards");
  store.dispatch({
    type: "LOAD_CARD",
    content: {
      ...session.currentCard,
      counter: session.counter,
    },
  });

  // // Debug: Show dependencies
  // if (isDev) {
  //   console.log(
  //     getTermsFromCards(
  //       Object.keys(session.currentCard.dependenciesAndSameTerm)
  //     ).map(printWord)
  //   );
  // }

  // // Debug: Show score
  // if (
  //   this.deck.schedule[session.currentCard.id] &&
  //   isDev
  // ) {
  //   console.log(
  //     `Score of "${printWord(session.currentCard.id)}": ${
  //       this.deck.schedule[session.currentCard.id].score
  //     } - last interval: ${
  //       this.deck.schedule[session.currentCard.id].last_interval_in_days
  //     }`
  //   );
  // }
}
