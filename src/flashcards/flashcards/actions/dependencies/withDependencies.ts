import { Card, Cards } from "flashcards/flashcards/actions/card/card";

/**
 * Returns an array of cards with all necessary dependencies of a card coming
 * before it
 *
 * TODO: Finish
 */
export const withDependencies = (
  cards: Card[],
  options?: { skipSiblings?: boolean; addOnlyBad?: boolean },
): Card[] => {
  let out = new Cards();
  for (const card of cards) {
    [...card.row.dependencies.dependenciesWithDepth.entries()]
      .sort((a, b) => a[1] - b[1])
      .map(([row, depth]) => row)
      .forEach((row) => {
        row.cards.forEach((c) => {
          // if(options?.addOnlyBad && !(
          //   !isInSession(card) &&
          //   /* Keep in those already chosen */
          //   (card.isIn(chosenCards) ||
          //     (isBad(card) && wasRowSeenMoreRecentlyThan(card, 45 * minutes)) ||
          //     (isFairlyBad(card) && wasRowSeenMoreRecentlyThan(card, 2 * days))),
          // )) return;
          out.add(c);
        });
      });
  }
  return out;
};
