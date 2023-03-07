import { Card } from "flashcards/flashcards/actions/card/card";
import { isNewRow } from "flashcards/flashcards/actions/card/cardSchedule";
import { Row } from "flashcards/flashcards/actions/row/row";
import { Rating } from "flashcards/flashcards/types";
import { mapValueToRange } from "modules/math";
import { RowId } from "flashcards/flashcards/actions/row/rowData";

export function percentageKnown(cards: Card[]): number {
  // if (!getEntireSchedule()) return 0;
  let done = 0;
  let remaining = 0;
  cards.forEach((card) => {
    if (card.isIgnored) return;
    if (!isNewRow(card)) {
      let score = card.score || 2;
      let toAdd;
      if (score < Rating.GOOD) {
        toAdd = mapValueToRange({
          value: score,
          inputFrom: Rating.BAD,
          inputTo: Rating.GOOD,
          outputFrom: 0.05,
          outputTo: 0.9,
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
    percentage = Number((ratio * 100).toFixed(2));
  }
  return percentage;
}

export function percentageSeen(cards: Card[]) {
  let seen = 0;
  let unseen = 0;
  cards.forEach((card) => {
    if (card.isIgnored) return;
    if (!isNewRow(card)) {
      seen++;
    } else {
      unseen++;
    }
  });

  if (seen === 0) return 0;
  return ((seen / (seen + unseen)) * 100).toFixed(2);
}

export function PercentageKnownOverall() {
  throw new Error("Not implemented");
  // return PercentageKnown(Object.keys(getCardIdsFromAllDecks()) as CardIds);
}

// if (isBrowser) {
//   window.PercentageKnownOverall = PercentageKnownOverall;
// }

export function countNumberOfRows(rows: Map<RowId, Row>) {
  return [...rows.values()].filter((row) => !row.data.deleted).length;
}
