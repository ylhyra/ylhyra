import { deck } from "app/vocabulary/actions/deck";
import { printWord } from "app/vocabulary/actions/functions";
import {
  getEasinessLevel,
  isEasinessLevelOn,
} from "app/vocabulary/actions/easinessLevel/functions";
import { BAD, GOOD } from "app/vocabulary/actions/cardInSession";
import {
  getCardIdsFromTermIds,
  getCardsByIds,
  getCardsFromTermId,
} from "app/vocabulary/actions/card/functions";
import _ from "underscore";
import { getPlaintextFromFormatted } from "maker/vocabulary_maker/compile/format";
import { INCR } from "app/vocabulary/actions/createSchedule";
import { minIgnoreFalsy } from "app/app/functions/math";
import { days, getTime } from "app/app/functions/time";
import { saveScheduleForCardId } from "app/vocabulary/actions/sync";

const matchWords = /([a-záéíóúýðþæö]+)/i;

/** @typedef {string} CardID */
/** @typedef {string} TermID */

/**
 * @typedef {Object} CardData
 *
 * @property {CardID} id
 * @property {Array.<TermID>} terms
 * @property {number} sortKey
 * @property {string} is_formatted - HTML of Icelandic side of card
 * @property {string} en_formatted - HTML of English side of card
 * @property {("is"|"en")} from
 * @property {("is"|"en")} to
 * @property {number=} level
 * @property {Array.<string>} spokenSentences - List of URLs
 * @property {number=} row_id - Used in the backend
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
 */
class Card {
  constructor(data) {
    Object.assign(this, data);
    this.data = data;
    // this.extractText();
  }

  /**
   * @returns {CardID}
   */
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
   * @returns {Array.<TermID>}
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
   * @returns {?CardInSession}
   */
  getAsCardInSession() {
    return deck.session?.cards.find((card) => card.getId() === this.getId());
  }

  /************************************************
                     Schedule
   ************************************************/

  /**
   * @returns {?ScheduleData}
   */
  getSchedule() {
    return deck.schedule[this.getId()];
  }

  /**
   * @returns {?TimestampInMilliseconds}
   */
  getDue() {
    return this.getSchedule()?.due;
  }

  /**
   * @returns {?Number}
   */
  getScore() {
    return this.getSchedule()?.score;
  }

  /**
   * @returns {Number}
   */
  getSessionsSeen() {
    return this.getSchedule()?.sessions_seen || 0;
  }

  /**
   * @returns {?Days}
   */
  getLastIntervalInDays() {
    return this.getSchedule()?.last_interval_in_days;
  }

  /**
   * @returns {?TimestampInMilliseconds}
   */
  getLastSeen() {
    return this.getSchedule()?.last_seen;
  }

  /**
   * @returns {?Boolean}
   */
  isBad() {
    return this.getScore() === BAD;
  }

  /**
   * @returns {?Boolean}
   */
  isFairlyBad() {
    return this.getScore() && this.getScore() <= BAD + INCR;
  }

  /**
   * @returns {?Boolean}
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
   * @returns {?Number}
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
   * @returns {?Number}
   */
  getTermLastSeen() {
    return Math.max(
      ...this.getAllCardsWithSameTerm()
        .map((card) => card.getLastSeen())
        .filter(Boolean)
    );
  }

  /**
   * @returns {Days|null}
   */
  daysSinceTermWasSeen() {
    if (!this.getTermLastSeen()) return null;
    return (getTime() - this.getTermLastSeen()) / days;
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

  /**
   * @param {ScheduleData} data
   */
  setSchedule(data) {
    deck.schedule[this.getId()] = {
      ...(deck.schedule[this.getId()] || {}),
      ...data,
    };
    saveScheduleForCardId(this.getId());
  }

  /************************************************
                     Related cards
   ************************************************/

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
   * @returns {Object.<TermID, number>}
   */
  getDependenciesAsTermIdToDepth() {
    return this.getTerms()[0]?.getDependenciesAsTermIdToDepth();
  }

  /**
   * @returns {Object.<CardID, number>}
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
   * @returns {Array.<CardID>}
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
   * @returns {?number}
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

export default Card;
