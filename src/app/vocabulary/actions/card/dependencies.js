import {
  getCardsByIds,
  getCardsFromTermId,
  getCardsFromTermIds,
} from "app/vocabulary/actions/card/functions";
import _ from "underscore";
import { getTermsFromCards } from "app/vocabulary/actions/functions";

/**
 * Returns an array of cards with all
 * necessary dependencies of a card coming before it
 */
export const withDependencies = (cards) => {
  let card_ids = [];
  getTermsFromCards(cards).forEach((term) => {
    term.getSortedCardDependencies().forEach((card) => {
      card_ids.push(card.getId());
    });
  });
  return getCardsByIds(_.uniq(card_ids));
};

/**
 * Cards with the same term that are not this card
 * @module Card
 */
export function getSiblingCards() {
  return this.getAllCardsWithSameTerm().filter(
    (siblingCard) => siblingCard.getId() !== this.getId()
  );
}

/**
 * @module Card
 */
export function getAllCardsWithSameTerm() {
  let out = [];
  this.getTerms().forEach((term) => {
    term.getCards().forEach((card) => {
      out.push(card);
    });
  });
  return out;
}

/**
 * @module Card
 */
export function getDependenciesAsTermIdToDepth() {
  return this.getTerms()[0]?.getDependenciesAsTermIdToDepth();
}

/**
 * @module Card
 */
export function getDependenciesAsCardIdToDepth() {
  let out = [];
  const deps = this.getDependenciesAsTermIdToDepth;
  Object.keys(deps).forEach((term_id) => {
    getCardsFromTermId(term_id).forEach((card) => {
      out[card.getId()] = deps[term_id];
    });
  });
  return out;
}

/**
 * @module Card
 */
export function getDependenciesAsArrayOfCards() {
  return getCardsFromTermIds(
    Object.keys(this.getDependenciesAsTermIdToDepth())
  ).filter((card) => card.getId() !== this.getId());
}

/**
 * @module Card
 */
export function dependencyDepthOfCard(related_card) {
  return this.getDependenciesAsCardIdToDepth()[related_card.getId()];
}

/**
 * @module Card
 */
export function hasTermsInCommonWith(card2) {
  return _.intersection(this.getTermIds(), card2.getTermIds()).length > 0;
}
