import { deck } from "app/vocabulary/actions/deck";
import { getCardIdsFromTermIds } from "app/vocabulary/actions/card/functions";
import { getTermIds } from "app/vocabulary/actions/card/card_data";
import _ from "underscore";
import {
  getCardIdsFromTermId,
  getCardIdsShuffledIfSeen,
} from "app/vocabulary/actions/card/term";
import {
  CardId,
  CardIds,
  TermId,
  TermIds,
} from "app/vocabulary/actions/card/types";

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

export const dependencyDepthOfCard = (id: CardId, card2) => {
  return getDependenciesAsCardIdToDepth(id)[card2.getId()];
};

export const hasTermsInCommonWith = (id: CardId, card2) => {
  return _.intersection(getTermIds(id), card2.getTermIds()).length > 0;
};

export const hasDependenciesInCommonWith = (id: CardId, card2) => {
  const x2 = card2.getDependenciesAsArrayOfCardIds();
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
