import { average, clamp, mapValueToRange, round } from "app/App/functions/math";
import {
  getHash,
  getPlaintextFromFormatted,
} from "app/VocabularyMaker/functions";
import store from "app/App/store";
import { InitializeSession } from "app/Vocabulary/actions/session";
import { updateURL } from "app/Router/actions";
import Card, { BAD, GOOD, EASY } from "app/Vocabulary/actions/card";
import _ from "underscore";
import { MAX_SECONDS_TO_COUNT_PER_ITEM } from "app/Vocabulary/actions/session";
import { MakeSummaryOfCardStatuses } from "app/Vocabulary/actions/functions";
import { deck } from "app/Vocabulary/actions/deck";

export const PercentageKnown = (card_ids) => {
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
      // /* 2.02 counts as fully known, while 1 counts as not known */
      // const output = mapValueToRange({
      //   value: score,
      //   input_from: 1,
      //   input_to: 1.8,
      //   output_from: 0.05,
      //   output_to: 1,
      //   clamp: true,
      // });
      done += toAdd;
      remaining += 1 - toAdd;
    } else {
      remaining++;
    }
  });

  const summary = MakeSummaryOfCardStatuses(card_ids);
  const done_count = summary.good + summary.easy * 1 + summary.bad * 0.3;
  const ratio = done / (remaining + done) || 0;
  let percentage;
  if (card_ids.length < 200) {
    percentage = Math.ceil(ratio * 100);
    if (percentage === 100 && done !== remaining) percentage = 99;
    return percentage;
  } else {
    percentage = (ratio * 100).toFixed(2);
  }
  return percentage;
};

export const PercentageKnownOverall = () => {
  if (!deck) return null;
  const card_ids = Object.keys(deck.cards);
  return PercentageKnown(card_ids);
};
