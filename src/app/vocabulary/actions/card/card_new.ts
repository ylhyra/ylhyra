import { deck } from "app/vocabulary/actions/deck";
import type { CardIds } from "../createCards/1_Old_cards";

export const getSchedule = (id) => {
  return deck.schedule[id];
};

export const getDue = (id) => {
  return getSchedule(id)?.due;
};

export const isAllowed = (id: CardId): boolean => {
  return true;
};

export const getCardsInSchedule = (): CardIds => {
  return Object.keys(deck.schedule);
};
