import store from "app/app/store";

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
  //   log(
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
  //   log(
  //     `Score of "${printWord(session.currentCard.id)}": ${
  //       this.deck.schedule[session.currentCard.id].score
  //     } - last interval: ${
  //       this.deck.schedule[session.currentCard.id].last_interval_in_days
  //     }`
  //   );
  // }
}
