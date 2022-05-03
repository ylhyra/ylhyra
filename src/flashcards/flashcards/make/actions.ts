import { store } from "flashcards/app/store";
import { customHistory } from "modules/router";
import shortid from "shortid";

export const newDeck = () => {
  const id = shortid.generate();
  store.flashcardStore.decks[id] = {
    id,
    settings: {},
    cards: {},
  };
  customHistory.replace(`/flashcards/deck/${id}`);
};
