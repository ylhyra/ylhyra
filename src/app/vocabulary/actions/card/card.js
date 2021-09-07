import { deck } from "app/vocabulary/actions/deck";
import {
  getCardsWithSameTerm,
  printWord,
} from "app/vocabulary/actions/functions";
import { now } from "app/app/functions/time";
import { saveScheduleForCardId } from "app/vocabulary/actions/sync";
import {
  getEasinessLevel,
  isEasinessLevelOn,
} from "app/vocabulary/actions/easinessLevel/functions";
import { BAD } from "app/vocabulary/actions/cardInSession";
import { INCR } from "app/vocabulary/actions/createSchedule";

export class Card {
  constructor(data) {
    Object.assign(this, data);
  }
  getId() {
    return this.id;
  }
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
  isScoreLowerThanOrEqualTo(value) {
    return this.getScore() && this.getScore() <= value;
  }
  getLowestAvailableTermScore() {
    let lowest = null;
    this.getSiblingCards({ all: true }).forEach((card) => {
      if (card.getScore()) {
        lowest = Math.min(lowest, card.getScore());
      }
    });
    return lowest;
  }
  isBelowEasinessLevel() {
    return isEasinessLevelOn() && this.sortKey < getEasinessLevel();
  }
  isInSchedule() {
    return this.getId() in deck.schedule;
  }
  isNewCard() {
    return !this.isInSchedule();
  }
  printWord() {
    return printWord(this.getId());
  }
  setSchedule(data) {
    deck.schedule[this.getId()] = {
      ...(deck.schedule[this.getId()] || {}),
      ...data,
    };
    saveScheduleForCardId(this.getId());
  }
  getTerms() {
    return this.terms.map((term_id) => deck.terms[term_id]);
  }
  /**
   * Cards with the same term
   */
  getSiblingCards(options = {}) {
    let out = [];
    this.getTerms().forEach((term) => {
      term.getCards().forEach((siblingCard) => {
        if (options.all || siblingCard.getId() !== this.getId()) {
          out.push(siblingCard);
        }
      });
    });
    return out;
  }
  isAllowed({ forbidden_ids, allowed_ids }) {
    return (
      !forbidden_ids.includes(this.getId()) &&
      (!allowed_ids || allowed_ids.includes(this.getId()))
    );
  }
  getSortKeyAdjustedForEasinessLevel() {
    return this.sortKey > getEasinessLevel()
      ? this.sortKey
      : 100000 - this.sortKey;
  }
}
