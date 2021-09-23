import { BAD } from "app/vocabulary/actions/cardInSession";
import {
  getCardIdsFromTermIds,
  getCardsByIds,
  getCardsFromTermId,
} from "app/vocabulary/actions/card/functions";
import _ from "underscore";
import { getPlaintextFromFormatted } from "maker/vocabulary_maker/compile/format";
const matchWords = /([a-záéíóúýðþæö]+)/i;

/**
 * Cards with the same term that are not this card
 * @memberOf Card#
 * @returns {Array.<Card>}
 */
export function getSiblingCards() {
  return this.getAllCardsWithSameTerm().filter(
    (siblingCard) => siblingCard.getId() !== this.getId()
  );
}

/**
 * @memberOf Card#
 * @returns {boolean}
 */
export function didAnySiblingCardsGetABadRatingInThisSession() {
  return this.getSiblingCards().some((sibling_card) => {
    return sibling_card.getAsCardInSession()?.history.includes(BAD);
  });
}

/**
 * @memberOf Card#
 * @returns {Array.<Card>}
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
 * @memberOf Card#
 * @returns {Object.<string, number>}
 */
export function getDependenciesAsTermIdToDepth() {
  return this.getTerms()[0]?.getDependenciesAsTermIdToDepth();
}

/**
 * @memberOf Card#
 * @returns {Object.<string, number>}
 */
export function getDependenciesAsCardIdToDepth() {
  let out = {};
  const deps = this.getDependenciesAsTermIdToDepth();
  Object.keys(deps).forEach((term_id) => {
    getCardsFromTermId(term_id).forEach((card) => {
      out[card.getId()] = deps[term_id];
    });
  });
  return out;
}

/**
 * @memberOf Card#
 * @returns {Array.<String>}
 */
export function getDependenciesAsArrayOfCardIds() {
  return getCardIdsFromTermIds(
    Object.keys(this.getDependenciesAsTermIdToDepth())
  ).filter((card_id) => card_id !== this.getId());
}

/**
 * @memberOf Card#
 * @returns {Array.<Card>}
 */
export function getDependenciesAsArrayOfCards() {
  return getCardsByIds(this.getDependenciesAsArrayOfCardIds());
}

/**
 * @memberOf Card#
 * @param {Card} card2
 * @returns {number|undefined}
 */
export function dependencyDepthOfCard(card2) {
  return this.getDependenciesAsCardIdToDepth()[card2.getId()];
}

/**
 * @memberOf Card#
 * @param {Card} card2
 * @returns {Boolean}
 */
export function hasTermsInCommonWith(card2) {
  return _.intersection(this.getTermIds(), card2.getTermIds()).length > 0;
}

/**
 * @memberOf Card#
 * @param {Card} card2
 * @returns {Boolean}
 */
export function hasDependenciesInCommonWith(card2) {
  return (
    _.intersection(
      this.getDependenciesAsArrayOfCardIds(),
      card2.getDependenciesAsArrayOfCardIds()
    ).length > 0
  );
}

/**
 * @memberOf Card#
 * @param {Card} card2
 * @returns {Boolean}
 */
export function isTextSimilarTo(card2) {
  return (
    _.intersection(this.simplifiedArrayOfWords, card2.simplifiedArrayOfWords)
      .length > 0
  );
}

/**
 * @memberOf Card#
 * Used for checking for card similarity.
 */
export function extractText() {
  this.simplifiedArrayOfWords =
    (
      getPlaintextFromFormatted(this.is_formatted) +
      " " +
      getPlaintextFromFormatted(this.en_formatted)
    )
      .match(matchWords)
      ?.filter((i) => i.length >= 3)
      .map((i) => {
        return (
          i
            .toLowerCase()
            .replaceAll("á", "a")
            .replaceAll("é", "e")
            .replaceAll(/[íyý]/g, "i")
            .replaceAll(/[óö]/g, "o")
            .replaceAll("ú", "u")
            /* Remove repeating characters */
            .replace(/(.)\1+/g, "$1")
        );
      }) || [];
}
