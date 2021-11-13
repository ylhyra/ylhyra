import { getTermsByIds } from "app/vocabulary/actions/card/functions";

// export const getDependenciesAsTermIdToDepth = (id: CardId) => {
//   // return getTerms(id)[0]?.getDependenciesAsTermIdToDepth();
// };

export const getDependenciesAsCardIdToDepth = (id: CardId) => {
  let out = {};
  const deps = getDependenciesAsTermIdToDepth(id);
  Object.keys(deps).forEach((term_id) => {
    getCardsFromTermId(term_id).forEach((card) => {
      out[getId(card)] = deps[term_id];
    });
  });
  return out;
};

export const getDependenciesAsArrayOfCardIds = (id: CardId) => {
  return memoize(id, "getDependenciesAsArrayOfCardIds", () =>
    getCardIdsFromTermIds(
      Object.keys(getDependenciesAsTermIdToDepth(id))
    ).filter((card_id) => card_id !== id)
  );
  // if (this.getdependenciesasarrayofcardids_memoized) {
  //   return this.getdependenciesasarrayofcardids_memoized;
  // }
  // this.getdependenciesasarrayofcardids_memoized = getcardidsfromtermids(
  //   object.keys(getdependenciesastermidtodepth(id))
  // ).filter((card_id) => card_id !== id);
  // return this.getdependenciesAsArrayOfCardIds_Memoized;
};

export const getDependenciesAsArrayOfCards = (id: CardId) => {
  return getCardsByIds(getDependenciesAsArrayOfCardIds(id));
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

export const termGetDependenciesAsTermIdToDepth = (term_id: TermId) => {
  return {
    ...(this.dependencies || {}),
    [this.getId()]: 0,
  };
};

export const getSortedTermDependencies = (term_id: TermId) => {
  const dependenciesAsTermIdToDepth =
    termGetDependenciesAsTermIdToDepth(term_id);
  let term_ids = Object.keys(dependenciesAsTermIdToDepth).sort(
    (a, b) => dependenciesAsTermIdToDepth[b] - dependenciesAsTermIdToDepth[a]
  );
  // if (options?.onlyDirect) {
  //   term_ids = term_ids.filter((a) => dependenciesAsTermIdToDepth[a] <= 1);
  // }
  return getTermsByIds(term_ids);
};

export const getSortedCardDependenciesAsCardIds = (term_id: TermId) => {
  return _.uniq(
    _.flatten(
      this.getSortedTermDependencies().map((term) =>
        term.getCardIdsShuffledIfSeen()
      )
    )
  );
};
