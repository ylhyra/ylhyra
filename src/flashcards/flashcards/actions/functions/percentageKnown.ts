import { Card } from "flashcards/flashcards/actions/card/card";
import { getEntireSchedule } from "flashcards/flashcards/actions/userData/userDataStore";
import { clamp, mapValueToRange } from "modules/math";

export const PercentageKnown = (cards: Card[]) => {
  if (!getEntireSchedule()) return 0;
  let done = 0;
  let remaining = 0;
  cards.forEach((card) => {
    if (card.isInSchedule()) {
      let score = card.getScore() || 2;
      let toAdd;
      if (score < 1.9) {
        toAdd = mapValueToRange({
          value:
            clamp(card.getSessionsSeen(), 0, 10) +
            clamp((card.getSessionsSeen() - 10) / 3, 0, 10),
          input_from: 0,
          input_to: 20,
          output_from: 0.1,
          output_to: 0.85,
          clamp: true,
        });
      } else {
        toAdd = 1;
      }
      done += toAdd;
      remaining += 1 - toAdd;
    } else {
      remaining++;
    }
  });

  const ratio = done / (remaining + done) || 0;
  if (ratio === 0) return 0;
  let percentage;
  if (cards.length < 200) {
    percentage = Math.ceil(ratio * 100);
    if (percentage === 100 && done !== remaining) percentage = 99;
  } else {
    percentage = (ratio * 100).toFixed(2);
  }
  return percentage;
};

export const PercentageKnownOverall = () => {
  throw new Error("Not implemented");
  // return PercentageKnown(Object.keys(getCardIdsFromAllDecks()) as CardIds);
};

// if (isBrowser) {
//   window.PercentageKnownOverall = PercentageKnownOverall;
// }
