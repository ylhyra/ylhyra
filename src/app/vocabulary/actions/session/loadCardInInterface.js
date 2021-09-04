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
      ...session.getCard(),
      counter: session.counter,
    },
  });
  if (process.env.NODE_ENV === "development") {
    console.log(
      getTermsFromCards(
        Object.keys(session.currentCard.dependenciesAndSameTerm)
      ).map(printWord)
    );
  }
  // if (
  //   this.deck.schedule[session.currentCard.id] &&
  //   process.env.NODE_ENV === "development"
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
