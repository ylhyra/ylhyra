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
import _ from "underscore";

export const getDependenciesAsTermIdToDepth = (id: CardId) => {
  const term_id: TermId = getTermIds(id)[0];
  return termGetDependenciesAsTermIdToDepth(term_id);
};

export const termGetDependenciesAsTermIdToDepth = (
  term_id: TermId
): Record<TermId, number> => {
  return {
    ...(deck.terms[term_id].dependencies || {}),
    [term_id]: 0,
  };
};

export const getDependenciesAsCardIdToDepth = (id: CardId) => {
  let out: Record<CardId, number> = {};
  const deps = getDependenciesAsTermIdToDepth(id);
  (Object.keys(deps) as TermIds).forEach((term_id) => {
    getCardIdsFromTermId(term_id).forEach((card_id) => {
      out[card_id] = deps[term_id];
    });
  });
  return out;
};

export const getDependenciesAsArrayOfCardIds = (id: CardId): CardIds => {
  return getCardIdsFromTermIds(
    Object.keys(getDependenciesAsTermIdToDepth(id)) as TermIds
  ).filter((card_id) => card_id !== id);
};

export const dependencyDepthOfCard = (id: CardId, card2: CardId) => {
  return getDependenciesAsCardIdToDepth(id)[card2];
};

export const hasTermsInCommonWith = (id: CardId, card2: CardId) => {
  return _.intersection(getTermIds(id), getTermIds(card2)).length > 0;
};

export const hasDependenciesInCommonWith = (id: CardId, card2: CardId) => {
  const x2 = getDependenciesAsArrayOfCardIds(card2);
  return getDependenciesAsArrayOfCardIds(id).some((card_id) =>
    x2.includes(card_id)
  );
};

export const getSortedTermDependencies = (term_id: TermId): TermIds => {
  const dependenciesAsTermIdToDepth =
    termGetDependenciesAsTermIdToDepth(term_id);
  let term_ids = (Object.keys(dependenciesAsTermIdToDepth) as TermIds).sort(
    (a, b) => dependenciesAsTermIdToDepth[b] - dependenciesAsTermIdToDepth[a]
  );
  // if (options?.onlyDirect) {
  //   term_ids = term_ids.filter((a) => dependenciesAsTermIdToDepth[a] <= 1);
  // }
  return term_ids;
};

export const getSortedCardDependenciesAsCardIds = (term_id: TermId) => {
  return _.uniq(
    _.flatten(
      getSortedTermDependencies(term_id).map((term) =>
        getCardIdsShuffledIfSeen(term)
      )
    )
  );
};
