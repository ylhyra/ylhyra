import { clamp, mapValueToRange } from "app/app/functions/math";
import { deck } from "app/vocabulary/actions/deck";
import { isBrowser } from "app/app/functions/isBrowser";
import { getCardsByIds } from "app/vocabulary/actions/card/functions";

export const PercentageKnown = (card_ids) => {
  if (!deck?.schedule) return 0;
  let done = 0;
  let remaining = 0;
  getCardsByIds(card_ids).forEach((card) => {
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
  if (card_ids.length < 200) {
    percentage = Math.ceil(ratio * 100);
    if (percentage === 100 && done !== remaining) percentage = 99;
  } else {
    percentage = (ratio * 100).toFixed(2);
  }
  return percentage;
};

export const PercentageKnownOverall = () => {
  if (!deck) return 0;
  return Object.keys(deck.cards) |> PercentageKnown;
};

// if (isBrowser) {
//   window.PercentageKnownOverall = PercentageKnownOverall;
// }
