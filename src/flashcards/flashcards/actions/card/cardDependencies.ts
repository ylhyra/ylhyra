import { getTermIds } from "flashcards/flashcards/actions/card/cardData";
import {
  getCardIdsFromTermId,
  getCardIdsFromTermIds,
  getCardIdsShuffledIfSeen,
} from "flashcards/flashcards/actions/card/term";
import {
  CardId,
  CardIds,
  DependenciesForOneTermAsDependencyToDepth,
  TermId,
  TermIds,
} from "flashcards/flashcards/types/types";
import _ from "underscore";
import { getTermIdFromCardId } from "flashcards/flashcards/compile/ids";

export const cardGetDependenciesAsTermIdToDepth = (
  id: CardId
): DependenciesForOneTermAsDependencyToDepth => {
  const termId: TermId = getTermIdFromCardId(id);
  return termGetDependenciesAsTermIdToDepth(termId);
};

export const termGetDependenciesAsTermIdToDepth = (
  termId: TermId
): DependenciesForOneTermAsDependencyToDepth => {
  console.warn("termGetDependenciesAsTermIdToDepth not implemented");
  return {};
  // return {
  //   ...(getTermsFromAllDecks()[termId].dependencies || {}),
  //   [termId]: 0,
  // };
};

export const getDependenciesAsCardIdToDepth = (id: CardId) => {
  let out: Record<CardId, number> = {};
  const deps = cardGetDependenciesAsTermIdToDepth(id);
  (Object.keys(deps) as TermIds).forEach((termId) => {
    getCardIdsFromTermId(termId).forEach((cardId) => {
      out[cardId] = deps[termId];
    });
  });
  return out;
};

export const getDependenciesAsArrayOfCardIds = (id: CardId): CardIds => {
  return getCardIdsFromTermIds(
    Object.keys(cardGetDependenciesAsTermIdToDepth(id)) as TermIds
  ).filter((cardId) => cardId !== id);
};

export const dependencyDepthOfCard = (id: CardId, card2: CardId): number => {
  return getDependenciesAsCardIdToDepth(id)[card2];
};

export const hasTermsInCommonWith = (id: CardId, card2: CardId) => {
  return _.intersection(getTermIds(id), getTermIds(card2)).length > 0;
};

/** @hasTests */
export const hasDependenciesInCommonWith = (card1: CardId, card2: CardId) => {
  const deps1 = getDependenciesAsArrayOfCardIds(card1);
  const deps2 = getDependenciesAsArrayOfCardIds(card2);
  return deps1.some((cardId) => deps2.includes(cardId));
};

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
