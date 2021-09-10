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
  getCardsFromTermId,
  getCardsFromTermIds,
} from "app/vocabulary/actions/card/functions";
import _ from "underscore";

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
  getTerms() {
    return this.terms.map((term_id) => deck.terms[term_id]);
  }
  getTermIds() {
    return this.terms;
  }
  isIn(arrayOfCards) {
    return arrayOfCards.some((card) => card.getId() === this.getId());
  }
  isInSession() {
    return this.isIn(deck.session.cards);
  }
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
  getSchedule() {
    return deck.schedule[this.getId()];
  }
  getDue() {
    return this.getSchedule()?.due;
  }
  getScore() {
    return this.getSchedule()?.score;
  }
  getSessionsSeen() {
    return this.getSchedule()?.sessions_seen;
  }
  getLastIntervalInDays() {
    return this.getSchedule()?.last_interval_in_days;
  }
  getLastSeen() {
    return this.getSchedule()?.last_seen;
  }
  isBad() {
    return this.getScore() === BAD;
  }
  isFairlyBad() {
    return this.getScore() && this.getScore() <= BAD + INCR;
  }
  isBelowGood() {
    return this.getScore() && this.getScore() < GOOD;
  }
  isUnseenOrNotGood() {
    return !this.getScore() || this.getScore() < GOOD;
  }
  isTermUnknownOrNotGood() {
    const lowest = this.getLowestAvailableTermScore();
    return !lowest || lowest < GOOD;
  }
  getLowestAvailableTermScore() {
    let lowest = null;
    this.getAllCardsWithSameTerm().forEach((card) => {
      if (card.getScore()) {
        lowest = minIgnoreFalsy(lowest, card.getScore());
      }
    });
    return lowest;
  }
  getTermLastSeen() {
    return Math.max(
      ...this.getAllCardsWithSameTerm()
        .map((card) => card.getLastSeen())
        .filter(Boolean)
    );
  }
  isInSchedule() {
    return this.getId() in deck.schedule;
  }
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
   */
  getSiblingCards() {
    return this.getAllCardsWithSameTerm().filter(
      (siblingCard) => siblingCard.getId() !== this.getId()
    );
  }
  getAllCardsWithSameTerm() {
    let out = [];
    this.getTerms().forEach((term) => {
      term.getCards().forEach((card) => {
        out.push(card);
      });
    });
    return out;
  }
  getDependenciesAsTermIdToDepth() {
    return this.getTerms()[0]?.getDependenciesAsTermIdToDepth();
  }
  getDependenciesAsCardIdToDepth() {
    let out = [];
    const deps = this.getDependenciesAsTermIdToDepth();
    Object.keys(deps).forEach((term_id) => {
      getCardsFromTermId(term_id).forEach((card) => {
        out[card.getId()] = deps[term_id];
      });
    });
    return out;
  }
  getDependenciesAsArrayOfCards() {
    return getCardsFromTermIds(
      Object.keys(this.getDependenciesAsTermIdToDepth())
    ).filter((card) => card.getId() !== this.getId());
  }
  dependencyDepthOfCard(related_card) {
    return this.getDependenciesAsCardIdToDepth()[related_card.getId()];
  }
  hasTermsInCommonWith(card2) {
    return _.intersection(this.getTermIds(), card2.getTermIds()).length > 0;
  }
}
