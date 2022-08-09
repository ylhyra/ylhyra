import { log } from "modules/log";
import { getTime } from "modules/time";
import CardInSession from "ylhyra/vocabulary/app/actions/cardInSession";
import Session, {
  MAX_SECONDS_TO_COUNT_PER_ITEM,
} from "ylhyra/vocabulary/app/actions/session/index";

export function updateRemainingTime(this: Session) {
  const diff = Math.min(
    MAX_SECONDS_TO_COUNT_PER_ITEM * 1000,
    getTime() - (this.lastTimestamp || 0),
  );
  this.remainingTime = Math.max(0, (this.remainingTime || 0) - diff);
  this.lastTimestamp = getTime();
  if (this.remainingTime <= 0) {
    void this.sessionDone();
    this.done = true;
  }
}

export function getPercentageDone(this: Session) {
  if (this.totalTime && this.remainingTime) {
    return ((this.totalTime - this.remainingTime) / this.totalTime) * 100;
  } else {
    return 0;
  }
}

export function checkIfCardsRemaining(this: Session): void {
  const areThereNewCardsRemaining = this.cards?.some(
    (i: CardInSession) =>
      !i.hasBeenSeenInSession() && !i.done && i.canBeShown(),
  );
  if (!areThereNewCardsRemaining) {
    log("No cards remaining");
    this.createMoreCards();
  }
}

export function createMoreCards(this: Session) {
  this.createCards();
  log("New cards generated");
}

export function answer(this: Session, rating: number) {
  const session = this;
  session.currentCard?.rate(rating);
  session.nextCard();
  if (!session.done) {
    session.loadCardInInterface();
  }
}
