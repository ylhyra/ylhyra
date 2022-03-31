import store from "ylhyra/app/app/store";

/**
 * @memberOf Session#
 */
export function loadCardInInterface() {
  const session = this;
  if (!session?.currentCard) return console.error("no cards");
  store.dispatch({
    type: "NEW_CARD_IN_INTERFACE",
    content: session.counter,
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
