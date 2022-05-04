import _ from "underscore";
import { getTermIds } from "ylhyra/vocabulary/app/actions/card/card_data";
import { getCardIdsFromTermIds } from "ylhyra/vocabulary/app/actions/card/functions";
import {
  getCardIdsFromTermId,
  getCardIdsShuffledIfSeen,
} from "ylhyra/vocabulary/app/actions/card/term";
import { deck } from "ylhyra/vocabulary/app/actions/deck";
import {
  CardId,
  CardIds,
  TermId,
  TermIds,
  TermIdToDependencyDepth,
} from "ylhyra/vocabulary/types";

export const getDependenciesAsTermIdToDepth = (
  id: CardId
): TermIdToDependencyDepth => {
  const termId: TermId = getTermIds(id)[0];
  return termGetDependenciesAsTermIdToDepth(termId);
};

export const termGetDependenciesAsTermIdToDepth = (
  termId: TermId
): TermIdToDependencyDepth => {
  return {
    ...(deck?.terms[termId].dependencies || {}),
    [termId]: 0,
  };
};

export const getDependenciesAsCardIdToDepth = (id: CardId) => {
  let out: Record<CardId, number> = {};
  const deps = getDependenciesAsTermIdToDepth(id);
  (Object.keys(deps) as TermIds).forEach((termId) => {
    getCardIdsFromTermId(termId).forEach((cardId) => {
      out[cardId] = deps[termId];
    });
  });
  return out;
};

export const getDependenciesAsArrayOfCardIds = (id: CardId): CardIds => {
  return getCardIdsFromTermIds(
    Object.keys(getDependenciesAsTermIdToDepth(id)) as TermIds
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
