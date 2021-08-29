import { average, clamp, mapValueToRange, round } from "app/App/functions/math";
import { deck } from "app/Vocabulary/actions/deck";
import { isBrowser } from "app/App/functions/isBrowser";

export const PercentageKnown = (card_ids) => {
  if (!deck || !deck.schedule) return 0;
  let done = 0;
  let remaining = 0;
  card_ids.forEach((id) => {
    if (id in deck.schedule) {
      let score = deck.schedule[id].score || 2;
      let toAdd;
      if (score < 1.9) {
        toAdd = mapValueToRange({
          value:
            clamp(deck.schedule[id].sessions_seen, 0, 10) +
            clamp((deck.schedule[id].sessions_seen - 10) / 3, 0, 10),
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
  const card_ids = Object.keys(deck.cards);
  return PercentageKnown(card_ids);
};

if (isBrowser) {
  window.PercentageKnownOverall = PercentageKnownOverall;
}
