import {
  getCardsByIds,
  getCardsFromTermId,
  getTermsByIds,
} from "app/vocabulary/actions/card/functions";
import { deck } from "app/vocabulary/actions/deck";
import _ from "underscore";

export class Term {
  constructor(data) {
    Object.assign(this, data);
  }
  getId() {
    return this.id;
  }
  getCards() {
    return getCardsByIds(this.cards);
  }
  getCardIds() {
    return this.cards;
  }
  getDependenciesAsTermIdToDepth() {
    return {
      ...this.dependencies,
      [this.getId()]: 0,
    };
  }
  getDependenciesAsCardIdToDepth() {
    let out = [];
    const deps = this.getDependenciesAsTermIdToDepth;
    Object.keys(deps).forEach((term_id) => {
      getCardsFromTermId(term_id).forEach((card) => {
        out[card.getId()] = deps[term_id];
      });
    });
    return out;
  }
  getSortedTermDependencies() {
    const dependenciesAsTermIdToDepth = this.getDependenciesAsTermIdToDepth();
    const term_ids = Object.keys(dependenciesAsTermIdToDepth).sort(
      (a, b) => dependenciesAsTermIdToDepth[b] - dependenciesAsTermIdToDepth[a]
    );
    return getTermsByIds(term_ids);
  }
  getSortedCardDependencies() {
    return getCardsByIds(
      _.uniq(
        _.flatten(
          this.getSortedTermDependencies().map((term) => term.getCardIds())
        )
      )
    );
  }
  // deck.terms[term_id2].cards.forEach((card_id) => {
  //   depth[card_id] = Math.max(
  //     depth[card_id] || 0,
  //     obj.temporaryDependencySortKey
  //   );
  // });
}
