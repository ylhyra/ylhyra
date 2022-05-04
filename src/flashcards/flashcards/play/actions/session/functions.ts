// export function updateRemainingTime("flashcards/app/store") {
//   const diff = Math.min(
//     MAX_SECONDS_TO_COUNT_PER_ITEM * 1000,
//     getTime() - (this.lastTimestamp || 0)
//   );
//   this.remainingTime = Math.max(0, (this.remainingTime || 0) - diff);
//   this.lastTimestamp = getTime();
//   if (this.remainingTime <= 0) {
//     this.sessionDone();
//     this.done = true;
//   }
// }
//
// export function getPercentageDone("flashcards/app/store") {
//   if (this.totalTime && this.remainingTime) {
//     return ((this.totalTime - this.remainingTime) / this.totalTime) * 100;
//   } else {
//     return 0;
//   }
// }

import { createCards } from "flashcards/flashcards/play/actions/createCards";

export function checkIfCardsRemaining(): void {
  // const areThereNewCardsRemaining = this.cards?.some(
  //   (i: CardInSession) => !i.hasBeenSeenInSession() && !i.done && i.canBeShown()
  // );
  // if (!areThereNewCardsRemaining) {
  //   log("No cards remaining");
  createCards();
  // }
}

// export function createMoreCards("flashcards/app/store") {
//   this.createCards();
//   log("New cards generated");
// }

// export function answer(rating: number) {
//   const session = this;
//   session.currentCard?.rate(rating);
//   session.nextCard();
//   if (!session.done) {
//     session.loadCardInInterface();
//   }
// }
