import { Deck } from "flashcards/flashcards/actions/deck/deck";
import {
  getSession,
  Session,
} from "flashcards/flashcards/actions/session/session";
import { addRowsIfMissing } from "flashcards/flashcards/editDeck/import/actions";
import { DeckId } from "flashcards/flashcards/types";

export const setupTestSession = (numOfDecks = 1): Session => {
  let decks = [];
  for (let i = 0; i < numOfDecks; i++) {
    const deck = new Deck(i.toString() as DeckId, {});
    let data = "";
    for (let i = 0; i < 1000; i++) {
      data += `test${i} = test${i}\n`;
    }
    addRowsIfMissing(deck, data);
    decks.push(deck);
  }
  const session = getSession();
  session.reset();
  session.allowedDecks = decks;
  return session;
};
