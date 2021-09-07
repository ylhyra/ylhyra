import { deck } from "app/vocabulary/actions/deck";

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
  isScoreLowerThanOrEqualTo(value) {
    return this.getScore() && this.getScore() <= value;
  }
}

export class Term {
  constructor(data) {
    Object.assign(this, data);
  }
}
