import { deck } from "app/vocabulary/actions/deck";
import { printWord } from "app/vocabulary/actions/functions";
import { now } from "app/app/functions/time";
import { saveScheduleForCardId } from "app/vocabulary/actions/sync";

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
}
