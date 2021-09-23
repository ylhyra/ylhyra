import { deck } from "app/vocabulary/actions/deck";
import { printWord } from "app/vocabulary/actions/functions";
import {
  getEasinessLevel,
  isEasinessLevelOn,
} from "app/vocabulary/actions/easinessLevel/functions";
import { extendPrototype } from "app/app/functions/extendPrototype";

/**
 * @typedef {Object} CardData
 *
 * @property {string} id
 * @property {Array.<string>} terms
 * @property {number} sortKey
 * @property {string} is_formatted - HTML of Icelandic side of card
 * @property {string} en_formatted - HTML of English side of card
 * @property {("is"|"en")} from
 * @property {("is"|"en")} to
 * @property {number=} level
 * @property {Array.<string>} spokenSentences - List of URLs
 * @property {number=} row_id - Used in the backend
 *
 * Various notes:
 * @property {string=} lemmas
 * @property {string=} note - Shown after answering
 * @property {string=} note_regarding_english - Shown below English before answering
 * @property {string=} pronunciation
 * @property {string=} literally
 * @property {string=} example_declension
 */

/**
 * @name Card
 * @augments CardData
 * @param {CardData} data - Data is both assigned to the object itself and to a
 *   data field to be able to pass this data on to derived objects
 * @namespace
 */
class Card {
  constructor(data) {
    Object.assign(this, data);
    this.data = data;
    // this.extractText();
  }

  getId() {
    return this.id;
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
   * @returns {Array.<string>}
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

  isBelowEasinessLevel() {
    return isEasinessLevelOn() && this.sortKey < getEasinessLevel();
  }

  getSortKeyAdjustedForEasinessLevel() {
    return this.sortKey > getEasinessLevel()
      ? this.sortKey
      : 100000 - this.sortKey;
  }

  /**
   * @returns {CardInSession|undefined}
   */
  getAsCardInSession() {
    return deck.session?.cards.find((card) => card.getId() === this.getId());
  }
}

extendPrototype(
  Card,
  require("app/vocabulary/actions/card/schedule"),
  require("app/vocabulary/actions/card/relatedCards")
);

export default Card;
