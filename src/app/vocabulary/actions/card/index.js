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
}

export class Term {
  constructor(data) {
    Object.assign(this, data);
  }
}
