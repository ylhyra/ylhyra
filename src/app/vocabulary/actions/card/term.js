import {
  getCardsByIds,
  getTermsByIds,
} from "app/vocabulary/actions/card/functions";
import _ from "underscore";

/**
 * @property {TermID} id
 * @property {Array.<CardID>} cards
 * @property {Object.<TermID, number>} dependencies
 */
export class Term {
  constructor(data, id) {
    Object.assign(this, data);
    this.id = id;
  }

  /**
   * @returns {TermID}
   */
  getId() {
    return this.id;
  }

  /**
   * @returns {Array<Card>}
   */
  getCards() {
    return getCardsByIds(this.cards);
  }

  /**
   * @returns {Array<CardID>}
   */
  getCardIds() {
    return this.cards;
  }

  /**
   * @returns {Object.<TermID, number>}
   */
  getDependenciesAsTermIdToDepth() {
    return {
      ...(this.dependencies || {}),
      [this.getId()]: 0,
    };
  }

  /**
   * @returns {Array<Term>}
   */
  getSortedTermDependencies() {
    const dependenciesAsTermIdToDepth = this.getDependenciesAsTermIdToDepth();
    const term_ids = Object.keys(dependenciesAsTermIdToDepth).sort(
      (a, b) => dependenciesAsTermIdToDepth[b] - dependenciesAsTermIdToDepth[a]
    );
    return getTermsByIds(term_ids);
  }

  /**
   * @returns {Array<CardID>}
   */
  getSortedCardDependenciesAsCardIds() {
    return _.uniq(
      _.flatten(
        this.getSortedTermDependencies().map((term) => term.getCardIds())
      )
    );
  }
}
