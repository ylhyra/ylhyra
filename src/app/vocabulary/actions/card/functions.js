import { deck } from "app/vocabulary/actions/deck";
import { CARDS_TO_CREATE } from "app/vocabulary/actions/createCards";
import { isEasinessLevelOn } from "app/vocabulary/actions/easinessLevel/functions";

export const getCardById = (card_id) => {
  return deck.cards[card_id] || null;
};

export const getCardsByIds = (card_ids) => {
  return card_ids.map(getCardById).filter(Boolean);
};

export const getCardsInSchedule = () => {
  return Object.keys(deck.schedule).map(getCardById).filter(Boolean);
};

export const getNewCards = () => {
  return deck.cards.filter((card) => !card.isInSchedule());
};
