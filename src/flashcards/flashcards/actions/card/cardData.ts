import { Card } from "flashcards/flashcards/actions/card/card";

export function getLevel(this: Card) {
  throw new Error("Not implemented");
  // return getCardData(id, "level");
}

export const getSortKey = (
  this: Card,
  options?: {
    englishLast?: boolean;
  }
): number => {
  throw new Error("Not implemented");
  // if (options?.englishLast) {
  //   return (
  //     getCardData(cardId, "sortKey") + (getDirection(cardId) === "en" ? 0.5 : 0)
  //   );
  // } else {
  //   return getCardData(cardId, "sortKey");
  // }
};
