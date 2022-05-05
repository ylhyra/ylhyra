import { Row } from "flashcards/flashcards/types/row";
import {
  CardId,
  CardIds,
  Direction,
  TermId,
  TermIds,
} from "flashcards/flashcards/types/types";
import { getEntireSchedule } from "flashcards/flashcards/userDataStore";
import { filterCardsThatExist } from "ylhyra/vocabulary/app/actions/card/card";
import { getTermData } from "ylhyra/vocabulary/app/actions/card/term";

export const getCardsInSchedule = (): CardIds => {
  return filterCardsThatExist(Object.keys(getEntireSchedule()) as CardIds);
};

export const getCardData: {
  (id: CardId, key: "terms"): TermIds;
  <T extends keyof Row>(id: CardId, key: T): Row[T];
} = (id: CardId, key: string) => {
  if (!(id in getCardsFromAllDecks())) {
    console.error(`Card not found:`, id);
    throw new Error();
  }
  if (key in getCardsFromAllDecks()[id]) {
    return (getCardsFromAllDecks()[id] as Row)[key as keyof Row];
  } else if (key === "terms") {
    /** The CardId is just a TermId with "_is" or "_en" added to the end */
    return [id.slice(0, -3)] as TermIds;
  } else if (getTermIds(id).length === 1) {
    // @ts-ignore
    return getTermData(getTermId(id))[key];
  } else {
    return null;
  }
};

/**
 * Direction is encoded in CardId
 * @see createCardId
 */
export const getDirection = (cardId: CardId) => {
  return cardId.split("-")[1] as Direction;
};

/**
 * TermId is encoded in CardId
 * @see createCardId
 */
export const getTermId = (cardId: CardId) => {
  return cardId.split("-")[0] as TermId;
};

/**
 * Deprecated: Each card can now only have one term
 * @deprecated
 */
export const getTermIds = (cardId: CardId): TermIds => {
  return [getTermId(cardId)];
};

export const getLevel = (id: CardId) => {
  return getCardData(id, "level");
};

export const getCardCEFR = getLevel;

// export const getImportance = (cardId: CardId) => {
//   return getCardData(cardId, "importance");
// };
//
// export const getDifficulty = (cardId: CardId) => {
//   return getCardData(cardId, "difficulty");
// };
//
// export const getSound = (cardId: CardId) => {
//   return getCardData(cardId, "sound");
// };

export const getSortKey = (
  cardId: CardId,
  options?: {
    englishLast?: Boolean;
  }
): number => {
  if (options?.englishLast) {
    return (
      getCardData(cardId, "sortKey") + (getDirection(cardId) === "en" ? 0.5 : 0)
    );
  } else {
    return getCardData(cardId, "sortKey");
  }
};
