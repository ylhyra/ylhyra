import { ProcessedDeck, TermIds } from "flashcards/flashcards/types/types";

/**
 * Returns an array of card ids sorted in such a way that
 * dependencies (cards that the user must have studied before
 * seeing a card) always come before the card that depends on it.
 */
export const sortDependenciesBeforeCardsThatDependOnThem = (
  deck: ProcessedDeck,
  termIds: TermIds
): TermIds => {
  throw new Error("Not implemented");
  // let returns: CardIds = [];
  // let termIds: TermIds = [];
  // let cardIdToDepth: CardIdToDependencyDepth = {};
  // if (typeof cardIds === "string") {
  //   cardIds = [cardIds];
  // }
  // cardIds
  //   .filter((cardId) => cardId in deck!.cards)
  //   .forEach((cardId) => {
  //     termIds = termIds.concat(getCardData(cardId, "terms"));
  //   });
  // termIds = _.uniq(termIds);
  // termIds.forEach((termId) => {
  //   let termsWithDependencySortKey = [{ term: termId, dependencySortKey: 0 }];
  //   const chain = dependencyToDepthForASingleTerm(deck, termId);
  //   Object.keys(chain).forEach((termId) => {
  //     termsWithDependencySortKey.push({
  //       term: termId as TermId,
  //       dependencySortKey: chain[termId as TermId],
  //     });
  //   });
  //   termsWithDependencySortKey = termsWithDependencySortKey.sort(
  //     (a, b) => b.dependencySortKey - a.dependencySortKey
  //   );
  //   termsWithDependencySortKey.forEach((obj) => {
  //     termId = obj.term;
  //     [termId, ...(deck!.alternativeIds[termId] || [])].forEach((j) => {
  //       if (j in deck!.terms) {
  //         let cardIds = deck!.terms[j].cards;
  //         cardIds = cardIds.sort((a) => {
  //           if (a.endsWith("is")) return -1;
  //           return 1;
  //         });
  //         returns = returns.concat(cardIds);
  //         deck!.terms[j].cards.forEach((cardId) => {
  //           cardIdToDepth[cardId as CardId] = Math.max(
  //             cardIdToDepth[cardId as CardId] || 0,
  //             obj.dependencySortKey
  //           );
  //         });
  //       }
  //     });
  //   });
  // });
  // const out = _.uniq(returns).filter((cardId) => cardId in deck!.cards);
  // return out;
};
