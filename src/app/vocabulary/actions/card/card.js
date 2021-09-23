import { deck } from "app/vocabulary/actions/deck";
import { printWord } from "app/vocabulary/actions/functions";
import {
  getEasinessLevel,
  isEasinessLevelOn,
} from "app/vocabulary/actions/easinessLevel/functions";
import { BAD } from "app/vocabulary/actions/cardInSession";
import {
  getCardIdsFromTermIds,
  getCardsByIds,
  getCardsFromTermId,
} from "app/vocabulary/actions/card/functions";
import _ from "underscore";
import { getPlaintextFromFormatted } from "maker/vocabulary_maker/compile/format";
import { extendPrototype } from "app/app/functions/extendPrototype";

const matchWords = /([a-záéíóúýðþæö]+)/i;

/**
 * @typedef {Object} CardData
 * @property {string} id
 * @property {Array.<string>} terms
 * @property {number} sortKey
 * @property {string} is_formatted - HTML of Icelandic side of card
 * @property {string} en_formatted - HTML of English side of card
 * @property {("is"|"en")} from
 * @property {("is"|"en")} to
 */

/**
 * @name Card
 * @augments CardData
 * @param {CardData} data - Data is both assigned to the object itself and to a
 *   data field to be able to pass this data on to derived objects
 * @namespace
 */
export class Card {
  constructor(data) {
    Object.assign(this, data);
    this.data = data;
    // this.extractText();
  }
  getId() {
    return this.id;
  }
  isBelowEasinessLevel() {
    return isEasinessLevelOn() && this.sortKey < getEasinessLevel();
  }
  printWord() {
    return this.getId() |> printWord;
  }

  /**
   * @returns {Array<Term>}
   */
  getTerms() {
    return this.getTermIds().map((term_id) => deck.terms[term_id]);
  }

  /**
   * @returns {Array<string>}
   */
  getTermIds() {
    return this.terms;
  }

  /**
   * @param {Array.<Card>} arrayOfCards
   * @returns {boolean}
   */
  isIn(arrayOfCards) {
    return arrayOfCards.some((card) => card.getId() === this.getId());
  }

  /**
   * @returns {Boolean}
   */
  isInSession() {
    return this.isIn(deck.session.cards);
  }

  /**
   * Used when creating new cards;
   * we want to ignore certain cards
   * @returns {boolean}
   */
  isAllowed() {
    const { allowed_ids } = deck.session;
    return (
      /* Ignore cards that are already in the session */
      !this.isInSession() &&
      /* If allowed_ids is on, only select allowed cards */
      (!allowed_ids || allowed_ids.includes(this.getId())) &&
      /* In case we're adding cards to an already ongoing session,
         ignore cards that are similar to a card the user has just seen */
      !deck.session.cardHistory
        .slice(0, 3)
        .some(
          (card) =>
            this.hasTermsInCommonWith(card) ||
            this.hasDependenciesInCommonWith(card) ||
            this.isTextSimilarTo(card)
        )
    );
  }

  getSortKeyAdjustedForEasinessLevel() {
    return this.sortKey > getEasinessLevel()
      ? this.sortKey
      : 100000 - this.sortKey;
  }

  /**************/

  /**
   * Cards with the same term that are not this card
   * @returns {Array.<Card>}
   */
  getSiblingCards() {
    return this.getAllCardsWithSameTerm().filter(
      (siblingCard) => siblingCard.getId() !== this.getId()
    );
  }

  /**
   * @returns {boolean}
   */
  didAnySiblingCardsGetABadRatingInThisSession() {
    return this.getSiblingCards().some((sibling_card) => {
      return sibling_card.getAsCardInSession()?.history.includes(BAD);
    });
  }

  /**
   * @returns {CardInSession|undefined}
   */
  getAsCardInSession() {
    return deck.session?.cards.find((card) => card.getId() === this.getId());
  }

  /**
   * @returns {Array.<Card>}
   */
  getAllCardsWithSameTerm() {
    let out = [];
    this.getTerms().forEach((term) => {
      term.getCards().forEach((card) => {
        out.push(card);
      });
    });
    return out;
  }

  /**
   * @returns {Object.<string, number>}
   */
  getDependenciesAsTermIdToDepth() {
    return this.getTerms()[0]?.getDependenciesAsTermIdToDepth();
  }

  /**
   * @returns {Object.<string, number>}
   */
  getDependenciesAsCardIdToDepth() {
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
   * @returns {Array.<String>}
   */
  getDependenciesAsArrayOfCardIds() {
    return getCardIdsFromTermIds(
      Object.keys(this.getDependenciesAsTermIdToDepth())
    ).filter((card_id) => card_id !== this.getId());
  }

  /**
   * @returns {Array.<Card>}
   */
  getDependenciesAsArrayOfCards() {
    return getCardsByIds(this.getDependenciesAsArrayOfCardIds());
  }

  /**
   * @param {Card} card2
   * @returns {number|undefined}
   */
  dependencyDepthOfCard(card2) {
    return this.getDependenciesAsCardIdToDepth()[card2.getId()];
  }

  /**
   * @param {Card} card2
   * @returns {Boolean}
   */
  hasTermsInCommonWith(card2) {
    return _.intersection(this.getTermIds(), card2.getTermIds()).length > 0;
  }

  /**
   * @param {Card} card2
   * @returns {Boolean}
   */
  hasDependenciesInCommonWith(card2) {
    return (
      _.intersection(
        this.getDependenciesAsArrayOfCardIds(),
        card2.getDependenciesAsArrayOfCardIds()
      ).length > 0
    );
  }

  /**
   * @param {Card} card2
   * @returns {Boolean}
   */
  isTextSimilarTo(card2) {
    return (
      _.intersection(this.simplifiedArrayOfWords, card2.simplifiedArrayOfWords)
        .length > 0
    );
  }

  /**
   * Used for checking for card similarity.
   */
  extractText() {
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
}

extendPrototype(Card, require("app/vocabulary/actions/card/schedule"));
