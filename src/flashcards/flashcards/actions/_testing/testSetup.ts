import { Session } from "flashcards/flashcards/actions/session/session";

export const setupTestSession = (numOfDecks = 1): Session => {
  throw new Error("Not implemented");
  // let decks = [];
  // for (let i = 0; i < numOfDecks; i++) {
  //   const deck = new Deck(i.toString() as DeckId, {});
  //   let data = "";
  //   for (let i = 0; i < 1000; i++) {
  //     data += `test${i} = test${i}\n`;
  //   }
  //   addRowsIfMissing(deck, data);
  //   decks.push(deck);
  // }
  // const session = store.session;
  // session.reset();
  // session.chosenDeck = decks;
  // return session;
};
