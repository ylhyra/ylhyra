import { clamp, mapValueToRange } from "ylhyra/app/app/functions/math";
import {
  getScore,
  getSessionsSeen,
  isInSchedule,
} from "ylhyra/vocabulary/app/actions/card/card_schedule";
import { deck } from "ylhyra/vocabulary/app/actions/deck";
import { CardIds } from "ylhyra/vocabulary/types";

export const PercentageKnown = (cardIds: CardIds) => {
  if (!deck?.schedule) return 0;
  let done = 0;
  let remaining = 0;
  cardIds.forEach((id) => {
    if (isInSchedule(id)) {
      let score = getScore(id) || 2;
      let toAdd;
      if (score < 1.9) {
        toAdd = mapValueToRange({
          value:
            clamp(getSessionsSeen(id), 0, 10) +
            clamp((getSessionsSeen(id) - 10) / 3, 0, 10),
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
  if (cardIds.length < 200) {
    percentage = Math.ceil(ratio * 100);
    if (percentage === 100 && done !== remaining) percentage = 99;
  } else {
    percentage = (ratio * 100).toFixed(2);
  }
  return percentage;
};

export const PercentageKnownOverall = () => {
  if (!deck) return 0;
  return PercentageKnown(Object.keys(deck!.cards) as CardIds);
};

// if (isBrowser) {
//   window.PercentageKnownOverall = PercentageKnownOverall;
// }
