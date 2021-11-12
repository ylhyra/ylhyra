import { deck } from "app/vocabulary/actions/deck";
import { printWord } from "app/vocabulary/actions/functions";
import {
  getEasinessLevel,
  isEasinessLevelOn,
} from "app/vocabulary/actions/easinessLevel/functions";
import { BAD, EASY, GOOD } from "app/vocabulary/actions/cardInSession";
import {
  getCardIdsFromTermIds,
  getCardsByIds,
  getCardsFromTermId,
} from "app/vocabulary/actions/card/functions";
import _, { uniq } from "underscore";
import { getPlaintextFromFormatted } from "maker/vocabulary_maker/compile/format";
import { INCR } from "app/vocabulary/actions/createSchedule";
import {
  maxIgnoreFalsy,
  minIgnoreFalsy,
  roundMsTo100Sec,
} from "app/app/functions/math";
import { getTime, minutes } from "app/app/functions/time";
import { matchWords } from "app/app/functions/languageProcessing/regexes";
import phoneticHash from "app/app/functions/languageProcessing/phoneticHash";
import { warnIfSlow } from "app/app/functions/warnIfSlow";
import { saveScheduleForCardId } from "app/vocabulary/actions/userData/userDataSchedule";

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
    // TODO! This takes too long, could be done on server
    // this.extractPhoneticHash();

    // /* Init memoizations */
    // setTimeout(() => {
    //   this.getAllCardIdsWithSameTerm();
    // }, 0);
  }

  clearMemoizations() {
    ["isAllowed", "getTermLastSeen"].forEach((key) => {
      if (getMemoizeKey(key) in this) {
        delete this[getMemoizeKey(key)];
      }
    });
  }

  memoize(key, func) {
    key = getMemoizeKey(key);
    if (this[key] === undefined) {
      this[key] = func.call(this);
    }
    return this[key];
  }

  /**
   * @returns {CardID}
   */
  getId() {
    return this.id;
  }

  printWord() {
    return printWord(this.getId());
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
    return this.memoize("isAllowed", () => {
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
    });
  }

  isBelowEasinessLevel() {
    return isEasinessLevelOn() && this.sortKey < getEasinessLevel();
  }

  getSortKeyAdjustedForEasinessLevel() {
    return this.getSortKeyAdjusted(getEasinessLevel());
  }

  getSortKeyAdjusted(j) {
    return this.sortKey > j ? this.sortKey : 100000 - this.sortKey;
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
   * Cards that received an Easy upon the first viewing
   * @returns {?Boolean}
   */
  isTooEasy() {
    return this.getScore() >= EASY && this.getSessionsSeen() === 1;
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
   * Is this term below good?
   * Or in the case of this card not having been seen
   * (e.g. only having been postponed) does it have bad siblings?
   * @returns {?Boolean}
   */
  isBelowGood() {
    const j = this.getScore() || this.getLowestAvailableTermScore();
    return j && j < GOOD;
  }

  /**
   * @returns {Boolean}
   */
  isUnseenCard() {
    return !this.getScore();
  }

  /**
   * @returns {Boolean}
   */
  isUnseenSiblingOfANonGoodCard() {
    if (!this.isUnseenCard()) return false;
    const l = this.getLowestAvailableTermScore();
    return l && l < GOOD;
  }

  /**
   * @returns {Boolean}
   */
  isUnseenTerm() {
    return !this.getTermLastSeen();
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
    return this.memoize("getTermLastSeen", () => {
      let max = 0;
      this.getAllCardsWithSameTerm().forEach((card) => {
        max = Math.max(max, card.getLastSeen() || 0);
      });
      return max;
    });
  }

  /**
   * @returns {?Milliseconds}
   */
  timeSinceTermWasSeen() {
    let j = this.getTermLastSeen();
    if (!j) return null;
    return getTime() - j;
  }

  /**
   * @returns {?Boolean}
   */
  wasTermVeryRecentlySeen() {
    return this.wasTermSeenMoreRecentlyThan(45 * minutes);
  }

  /**
   * @returns {?Boolean}
   */
  wasTermSeenMoreRecentlyThan(time) {
    const i = this.timeSinceTermWasSeen();
    return i && i < time;
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
    if (data.due) {
      data.due = roundMsTo100Sec(data.due);
    }
    if (data.last_seen) {
      data.last_seen = roundMsTo100Sec(data.last_seen);
    }

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
    return getCardsByIds(this.siblingCardIds);
    // return this.getAllCardsWithSameTerm().filter(
    //   (siblingCard) => siblingCard.getId() !== this.getId()
    // );
  }

  /**
   * @returns {Array.<CardInSession>}
   */
  getSiblingCardsInSession() {
    return this.getSiblingCards()
      .filter((card) => card.isInSession())
      .map((card) => card.getAsCardInSession());
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
   * @returns {boolean}
   */
  isNewTerm() {
    // There exists at least one term
    return this.getTerms().some((term) =>
      // Where every cardInSession is new
      term
        .getCards()
        .every(
          (card) =>
            !card.isInSchedule() &&
            !card.getAsCardInSession()?.hasBeenSeenInSession()
        )
    );
  }

  // /**
  //  * @returns {Array.<CardID>}
  //  */
  // getAllCardIdsWithSameTerm() {
  //   // return this.memoize("getAllCardIdsWithSameTerm", () => {
  //   //   let out = [];
  //   //   this.getTerms().forEach((term) => {
  //   //     out = out.concat(term.getCardIds());
  //   //   });
  //   //   return _.uniq(out);
  //   // });
  // }

  /**
   * @returns {Array.<Card>}
   */
  getAllCardsWithSameTerm() {
    return getCardsByIds([this.getId(), ...this.siblingCardIds]);
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
    return this.memoize("getDependenciesAsArrayOfCardIds", () =>
      getCardIdsFromTermIds(
        Object.keys(this.getDependenciesAsTermIdToDepth())
      ).filter((card_id) => card_id !== this.getId())
    );
    // if (this.getdependenciesasarrayofcardids_memoized) {
    //   return this.getdependenciesasarrayofcardids_memoized;
    // }
    // this.getdependenciesasarrayofcardids_memoized = getcardidsfromtermids(
    //   object.keys(this.getdependenciesastermidtodepth())
    // ).filter((card_id) => card_id !== this.getid());
    // return this.getdependenciesAsArrayOfCardIds_Memoized;
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
    const x2 = card2.getDependenciesAsArrayOfCardIds();
    return this.getDependenciesAsArrayOfCardIds().some((card_id) =>
      x2.includes(card_id)
    );
  }

  /**
   * Checks similarity based on (approximate) Cologne phonetics
   * @param {Card} card2
   * @returns {Boolean}
   */
  isTextSimilarTo(card2) {
    return this.phoneticHashArray.some((first) =>
      card2.phoneticHashArray.some((second) => {
        return first === second;
        // (first.length === second.length ||
        //   (first.length >= 3 && second.length >= 3)) &&
        // (first.includes(second) || second.includes(first))
      })
    );
  }

  /**
   * Used for checking for card similarity.
   */
  extractPhoneticHash() {
    this.phoneticHashArray =
      uniq(
        (
          getPlaintextFromFormatted(this.is_formatted) +
          " " +
          getPlaintextFromFormatted(this.en_formatted)
        )
          .match(matchWords)
          ?.filter((i) => i.length >= 3)
          .map(phoneticHash)
      ) || [];
  }
}

export default Card;

const getMemoizeKey = (i) => {
  return `memoized_${i}`;
};
