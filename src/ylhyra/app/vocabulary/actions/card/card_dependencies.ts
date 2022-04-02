import _ from "underscore";
import { getTermIds } from "ylhyra/app/vocabulary/actions/card/card_data";
import { getCardIdsFromTermIds } from "ylhyra/app/vocabulary/actions/card/functions";
import {
  getCardIdsFromTermId,
  getCardIdsShuffledIfSeen,
} from "ylhyra/app/vocabulary/actions/card/term";
import {
  CardId,
  CardIds,
  TermId,
  TermIds,
} from "ylhyra/app/vocabulary/actions/card/types";
import { deck } from "ylhyra/app/vocabulary/actions/deck";

export const getDependenciesAsTermIdToDepth = (id: CardId) => {
  const termId: TermId = getTermIds(id)[0];
  return termGetDependenciesAsTermIdToDepth(termId);
};

export const termGetDependenciesAsTermIdToDepth = (
  termId: TermId
): Record<TermId, number> => {
  return {
    ...(deck.terms[termId].dependencies || {}),
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

export const dependencyDepthOfCard = (id: CardId, card2: CardId) => {
  return getDependenciesAsCardIdToDepth(id)[card2];
};

export const hasTermsInCommonWith = (id: CardId, card2: CardId) => {
  return _.intersection(getTermIds(id), getTermIds(card2)).length > 0;
};

export const hasDependenciesInCommonWith = (id: CardId, card2: CardId) => {
  const x2 = getDependenciesAsArrayOfCardIds(card2);
  return getDependenciesAsArrayOfCardIds(id).some((cardId) =>
    x2.includes(cardId)
  );
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
