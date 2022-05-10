import { Card } from "flashcards/flashcards/actions/card/card";
import {
  getCardIdsFromTermId,
  getCardIdsFromTermIds,
  getCardIdsShuffledIfSeen,
} from "flashcards/flashcards/actions/card/term";
import { getTermIdFromCardId } from "flashcards/flashcards/actions/deck/compile/ids";
import {
  CardId,
  CardIds,
  DependenciesForOneTermAsDependencyToDepth,
  TermId,
  TermIds,
} from "flashcards/flashcards/types/types";
import _ from "underscore";

export function cardGetDependenciesAsTermIdToDepth(
  this: Card
): DependenciesForOneTermAsDependencyToDepth {
  const termId: TermId = getTermIdFromCardId(id);
  return termGetDependenciesAsTermIdToDepth(termId);
}

/**
 * Note: Also includes itself as depth=0. I don't remember if this is used.
 */
export const termGetDependenciesAsTermIdToDepth = (
  termId: TermId
): DependenciesForOneTermAsDependencyToDepth => {
  throw new Error("Not implemented");
  // return {
  //   ...(getProcessedDeckById(getDeckId(termId))?.dependencyGraph[termId] || {}),
  //   [termId]: 0,
  // };
};

export function getDependenciesAsCardIdToDepth(this: Card) {
  let out: Record<CardId, number> = {};
  const deps = this.cardGetDependenciesAsTermIdToDepth();
  (Object.keys(deps) as TermIds).forEach((termId) => {
    getCardIdsFromTermId(termId).forEach((cardId) => {
      out[cardId] = deps[termId];
    });
  });
  return out;
}

export function getDependenciesAsArrayOfCardIds(this: Card): CardIds {
  return getCardIdsFromTermIds(
    Object.keys(cardGetDependenciesAsTermIdToDepth(cardId)) as TermIds
  ).filter((siblingCardId) => siblingCardId !== cardId);
}

export function dependencyDepthOfCard(this: Card, card2: Card): number {
  return this.getDependenciesAsCardIdToDepth()[card2.cardId];
}

export function hasDependenciesInCommonWith(this: Card, card2: Card) {
  const deps1 = this.getDependenciesAsArrayOfCardIds();
  const deps2 = card2.getDependenciesAsArrayOfCardIds();
  return deps1.some((cardId) => deps2.includes(cardId));
}

export const getSortedTermDependencies = (termId: TermId): TermIds => {
  const dependenciesAsTermIdToDepth =
    termGetDependenciesAsTermIdToDepth(termId);
  let termIds = (Object.keys(dependenciesAsTermIdToDepth) as TermIds).sort(
    (a, b) => dependenciesAsTermIdToDepth[b] - dependenciesAsTermIdToDepth[a]
  );
  // if (options?.onlyDirect) {
  //   termIds = termIds.filter((a) => dependenciesAsTermIdToDepth[a] <= 1);
  // }
  return termIds;
};

export const getSortedCardDependenciesAsCardIds = (termId: TermId) => {
  return _.uniq(
    _.flatten(
      getSortedTermDependencies(termId).map((term) =>
        getCardIdsShuffledIfSeen(term)
      )
    )
  );
};
