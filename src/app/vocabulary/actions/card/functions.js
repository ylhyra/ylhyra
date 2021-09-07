import { deck } from "app/vocabulary/actions/deck";

export const getCardById = (card_id) => {
  return deck.cards[card_id] || null;
};

export const getCardsInSchedule = () => {
  return Object.keys(deck.schedule).map(getCardById).filter(Boolean);
};

export const getNewCardsSorted = () => {};
