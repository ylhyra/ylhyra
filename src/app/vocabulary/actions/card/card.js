import { deck } from "app/vocabulary/actions/deck";
import { printWord } from "app/vocabulary/actions/functions";
import {
  getEasinessLevel,
  isEasinessLevelOn,
} from "app/vocabulary/actions/easinessLevel/functions";
import { BAD, GOOD } from "app/vocabulary/actions/cardInSession";
import { INCR } from "app/vocabulary/actions/createSchedule";
import { minIgnoreFalsy } from "app/app/functions/math";
import { saveScheduleForCardId } from "app/vocabulary/actions/sync";
import {
  getCardIdsFromTermIds,
  getCardsByIds,
  getCardsFromTermId,
  getCardsFromTermIds,
} from "app/vocabulary/actions/card/functions";
import _ from "underscore";

/**
 * @param {Object} data
 * @property {string} id
 * @property {Array.<string>} terms
 * @property {number} sortKey
 */
export class Card {
  constructor(data) {
    Object.assign(this, data);
    this.data = data;
  }
  getId() {
    return this.id;
  }
  isBelowEasinessLevel() {
    return isEasinessLevelOn() && this.sortKey < getEasinessLevel();
  }
  printWord() {
    return printWord(this.getId());
  }

  /**
   * @returns {Array<Term>}
   */
  getTerms() {
    return this.terms.map((term_id) => deck.terms[term_id]);
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
   * @returns {boolean}
   */
  isAllowed() {
    const { allowed_ids } = deck.session;
    return (
      !this.isInSession() &&
      (!allowed_ids || allowed_ids.includes(this.getId()))
    );
  }
  getSortKeyAdjustedForEasinessLevel() {
    return this.sortKey > getEasinessLevel()
      ? this.sortKey
      : 100000 - this.sortKey;
  }

  /**************/
  /**
   * @returns {Object|undefined}
   */
  getSchedule() {
    return deck.schedule[this.getId()];
  }

  /**
   * @returns {Number|undefined} - Timestamp in milliseconds
   */
  getDue() {
    return this.getSchedule()?.due;
  }

  /**
   * @returns {Number|undefined}
   */
  getScore() {
    return this.getSchedule()?.score;
  }

  /**
   * @returns {Number|undefined}
   */
  getSessionsSeen() {
    return this.getSchedule()?.sessions_seen;
  }

  /**
   * @returns {Number|undefined}
   */
  getLastIntervalInDays() {
    return this.getSchedule()?.last_interval_in_days;
  }

  /**
   * @returns {Number|undefined} - Timestamp in milliseconds
   */
  getLastSeen() {
    return this.getSchedule()?.last_seen;
  }

  /**
   * @returns {Boolean}
   */
  isBad() {
    return this.getScore() === BAD;
  }

  /**
   * @returns {Boolean}
   */
  isFairlyBad() {
    return this.getScore() && this.getScore() <= BAD + INCR;
  }

  /**
   * @returns {Boolean}
   */
  isBelowGood() {
    return this.getScore() && this.getScore() < GOOD;
  }

  /**
   * @returns {Boolean}
   */
  isUnseenOrNotGood() {
    return !this.getScore() || this.getScore() < GOOD;
  }

  /**
   * @returns {Boolean}
   */
  isTermUnknownOrNotGood() {
    const lowest = this.getLowestAvailableTermScore();
    return !lowest || lowest < GOOD;
  }

  /**
   * @returns {Number|undefined}
   */
  getLowestAvailableTermScore() {
    let lowest;
    this.getAllCardsWithSameTerm().forEach((card) => {
      if (card.getScore()) {
        lowest = minIgnoreFalsy(lowest, card.getScore());
      }
    });
    return lowest;
  }

  /**
   * @returns {Number|undefined}
   */
  getTermLastSeen() {
    return Math.max(
      ...this.getAllCardsWithSameTerm()
        .map((card) => card.getLastSeen())
        .filter(Boolean)
    );
  }

  /**
   * @returns {boolean}
   */
  isInSchedule() {
    return this.getId() in deck.schedule;
  }

  /**
   * @returns {boolean}
   */
  isNewCard() {
    return !this.isInSchedule();
  }
  setSchedule(data) {
    deck.schedule[this.getId()] = {
      ...(deck.schedule[this.getId()] || {}),
      ...data,
    };
    saveScheduleForCardId(this.getId());
  }
  /********/

  /**
   * Cards with the same term that are not this card
   * @module Card
   * @returns {Array.<Card>}
   */
  getSiblingCards() {
    return this.getAllCardsWithSameTerm().filter(
      (siblingCard) => siblingCard.getId() !== this.getId()
    );
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
   * @returns {Object.<string, Integer>}
   */
  getDependenciesAsTermIdToDepth() {
    return this.getTerms()[0]?.getDependenciesAsTermIdToDepth();
  }

  /**
   * @returns {Object.<string, Integer>}
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
   * @returns {Integer|undefined}
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
}
