import { getCardsFromTermId } from "app/vocabulary/actions/card/functions";
import { deck } from "app/vocabulary/actions/deck";

export class Term {
  constructor(data) {
    Object.assign(this, data);
  }
  getCards() {
    return this.cards.map((card_id) => deck.cards[card_id]).filter(Boolean);
  }
  getDependenciesAsTermIdToDepth() {
    return this.dependencies;
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
}
