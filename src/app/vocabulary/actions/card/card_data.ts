import { CardIds } from "app/vocabulary/actions/card/card";

export const getSchedule = (id: CardId) => {
  return deck.schedule[id];
};

export const getDue = (id: CardId) => {
  return getSchedule(id)?.due;
};

export const getCardsInSchedule = (): CardIds => {
  return Object.keys(deck.schedule);
};

export const getData = (id, key) => {
  if (key in this.data) {
    return this.data[key];
  } else if (key === "terms") {
    return [id.slice(0, -3)];
  } else if (getTermIds(id).length === 1) {
    return getTerms(id)[0][key];
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

export const printWord = (id: CardId) => {
  return printWord(id);
};

export const getTerms = (id: CardId) => {
  return getTermIds(id).map((term_id) => deck.terms[term_id]);
};

export const getTermIds = (id: CardId) => {
  return getData(id, "terms");
};

export const getSortKey = (id, options) => {
  if (options?.englishLast) {
    return getData(id, "sortKey") + getFrom(id) === "en" ? 0.5 : 0;
  } else {
    return getData(id, "sortKey");
  }
};
