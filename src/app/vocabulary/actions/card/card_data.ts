import { deck } from "app/vocabulary/actions/deck";
import {
  CardId,
  CardIds,
  filterCardsThatExist,
  TermIds,
} from "app/vocabulary/actions/card/card";
import { Timestamp } from "app/vocabulary/actions/session";
import { getTermData } from "app/vocabulary/actions/card/term";

export const getSchedule = (id: CardId) => {
  return deck.schedule[id];
};

export const getDue = (id: CardId): Timestamp | null => {
  return getSchedule(id)?.due;
};

export const getCardsInSchedule = (): CardIds => {
  return filterCardsThatExist(Object.keys(deck.schedule) as CardIds);
};

export const getData = (id, key) => {
  if (!(id in deck.cards)) {
    console.error(`Card not found:`, id);
    throw new Error();
  }
  if (key in deck.cards[id]) {
    return deck.cards[id][key];
  } else if (key === "terms") {
    return [id.slice(0, -3)];
  } else if (getTermIds(id).length === 1) {
    return getTermData(getTermIds(id)[0])[key];
  } else {
    return null;
  }
};

export const getFrom = (id: CardId) => {
  return id.slice(-2);
};

export const getId = (id: CardId) => {
  return getData(id, "id");
};

export const getSound = (id: CardId) => {
  return getData(id, "sound");
};

export const getTermIds = (id: CardId): TermIds => {
  return getData(id, "terms");
};

export const getSortKey = (id: CardId, options): number => {
  if (options?.englishLast) {
    return getData(id, "sortKey") + getFrom(id) === "en" ? 0.5 : 0;
  } else {
    return getData(id, "sortKey");
  }
};
