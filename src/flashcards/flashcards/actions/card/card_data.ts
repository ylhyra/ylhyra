import { filterCardsThatExist } from "ylhyra/vocabulary/app/actions/card/card";
import { getTermData } from "ylhyra/vocabulary/app/actions/card/term";

export const getCardsInSchedule = (): CardIds => {
  return filterCardsThatExist(Object.keys(deck!.schedule) as CardIds);
};

/**
 * Data that is shared across all sibling cards was moved in {@link simplifyDeck}
 * to be stored in the term instead, for de-duplication purposes.
 *
 * That is extremely confusing, though, and should be rethought!
 */
export const getCardData: {
  (id: CardId, key: "terms"): TermIds;
  <T extends keyof CardData>(id: CardId, key: T): CardData[T];
} = (id: CardId, key: string) => {
  if (!(id in deck!.cards)) {
    console.error(`Card not found:`, id);
    throw new Error();
  }
  if (key in deck!.cards[id]) {
    return (deck!.cards[id] as CardData)[key as keyof CardData];
  } else if (key === "terms") {
    /** The CardId is just a TermId with "_is" or "_en" added to the end */
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
 * "From" was deleted in the {@link simplifyDeck} step to reduce size.
 */
export const getFrom = (id: CardId) => {
  return id.slice(-2) as "is" | "en";
};

export const getId = (id: CardId) => {
  return id; // getCardData(id, "id");
};

export const getLevel = (id: CardId) => {
  return getCardData(id, "level");
};

export const getCardCEFR = getLevel;

export const getImportance = (cardId: CardId) => {
  return getCardData(cardId, "importance");
};

export const getDifficulty = (cardId: CardId) => {
  return getCardData(cardId, "difficulty");
};

export const getSound = (cardId: CardId) => {
  return getCardData(cardId, "sound");
};

export const getTermIds = (cardId: CardId) => {
  return getCardData(cardId, "terms")!;
};

export const getSortKey = (
  cardId: CardId,
  options?: {
    englishLast?: Boolean;
  }
): number => {
  if (options?.englishLast) {
    return (
      getCardData(cardId, "sortKey") + (getFrom(cardId) === "en" ? 0.5 : 0)
    );
  } else {
    return getCardData(cardId, "sortKey");
  }
};
