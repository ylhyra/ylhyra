import { filterCardsThatExist } from "ylhyra/vocabulary/app/actions/card/card";
import { getTermData } from "ylhyra/vocabulary/app/actions/card/term";
import { deck } from "ylhyra/vocabulary/app/actions/deck";
import { CardData, CardId, CardIds, TermIds } from "ylhyra/vocabulary/types";

export const getCardsInSchedule = (): CardIds => {
  return filterCardsThatExist(Object.keys(deck!.schedule) as CardIds);
};

/**
 * Data that is shared across all sibling cards was moved in {@link simplifyDeck}
 * to be stored in the term instead, for de-duplication purposes.
 *
 * That is extremely confusing, though, and should be rethought!
 */
export const getCardData = <T extends keyof CardData>(
  id: CardId,
  key: T
): CardData[T] => {
  if (!(id in deck!.cards)) {
    console.error(`Card not found:`, id);
    throw new Error();
  }
  if (key in deck!.cards[id]) {
    return (deck!.cards[id] as CardData)[key];
  } else if (key === "terms") {
    /** The CardId is just a TermId with "_is" or "_en" added to the end */
    // @ts-ignore
    return [id.slice(0, -3)] as TermIds;
  } else if (getTermIds(id).length === 1) {
    // @ts-ignore
    return getTermData(getTermIds(id)[0])[key];
  } else {
    return null;
  }
};

/**
 * "From" is encoded as the final part of the CardId, e.g. asdf_is or asdf_en.
 * TODO: Is "from" not in CardData?
 */
export const getFrom = (id: CardId) => {
  return id.slice(-2) as "is" | "en";
};

export const getId = (id: CardId) => {
  return id; // getCardData(id, "id");
};

export const getLevel = (id: CardId): number => {
  return getCardData(id, "level");
};

export const getCardLevel = getLevel;
export const getCardCEFR = getLevel;

export const getImportance = (cardId: CardId): number => {
  return getCardData(cardId, "importance");
};

export const getDifficulty = (cardId: CardId): number => {
  return getCardData(cardId, "difficulty");
};

export const getSound = (cardId: CardId) => {
  return getCardData(cardId, "sound");
};

export const getTermIds = (cardId: CardId): TermIds => {
  return getCardData(cardId, "terms");
};

export const getSortKey = (cardId: CardId, options?): number => {
  if (options?.englishLast) {
    return getCardData(cardId, "sortKey") + getFrom(cardId) === "en" ? 0.5 : 0;
  } else {
    return getCardData(cardId, "sortKey");
  }
};
