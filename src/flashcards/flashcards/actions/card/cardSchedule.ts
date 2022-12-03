import { Card } from "flashcards/flashcards/actions/card/card";
import { getAsCardInSession } from "flashcards/flashcards/actions/card/functions";
import { Rating, Score } from "flashcards/flashcards/types";
import { store } from "flashcards/store";
import { minIgnoreFalsy, roundMsTo100Sec } from "modules/math";
import {
  getTimeMemoized,
  hours,
  Milliseconds,
  minutes,
  Timestamp,
} from "modules/time";
import { ScheduleData } from "flashcards/flashcards/actions/session/schedule";
import { SyncedData } from "flashcards/userData/userDataValue";

/**
 * We consider a card overdue if it's due date is less than 16 hours from now
 */
export function isOverdue(card1: Card): Boolean {
  const timestampToCompareTo = getTimeMemoized() + 16 * hours;
  const dueAt = card1.dueAt;
  return dueAt ? dueAt < timestampToCompareTo : false;
}

export function isUnseenSiblingOfANonGoodCard(card1: Card) {
  if (!isNewCard(card1)) return false;
  const lowest = getLowestAvailableRowScore(card1);
  return lowest && lowest < Rating.GOOD;
}

/**
 * Note that a card may be in the schedule without having been seen (it may just
 * have been postponed instead).
 */
export function isInSchedule(card1: Card) {
  return store.schedule.has(card1.cardId);
}

export function setSchedule(
  card1: Card,
  data: Omit<ScheduleData, keyof SyncedData | "cardId">,
) {
  /* Round timestamps */
  ["due", "lastSeen", "lastBadTimestamp"].forEach((key) => {
    if (key in data) {
      // @ts-ignore
      data[key] = roundMsTo100Sec(data[key]);
    }
  });

  new ScheduleData({
    ...(card1.schedule || {}),
    ...data,
    cardId: card1.cardId,
  });
}

export function getLowestAvailableRowScore(card1: Card): Score | null {
  let lowestScore: Score | null = null;
  card1.row.cards.forEach((card) => {
    if (card.score) {
      lowestScore = minIgnoreFalsy(lowestScore, card.score);
    }
  });
  return lowestScore;
}

export function getRowLastSeen(card1: Card): Timestamp | null {
  let max: Timestamp | null = null;
  card1.row.cards.forEach((card) => {
    max = Math.max(max || 0, card.lastSeen || 0);
  });
  return max;
}

export function timeSinceRowWasSeen(card1: Card): Milliseconds | null {
  let j = getRowLastSeen(card1);
  if (!j) return null;
  return getTimeMemoized() - j;
}

/** Whether a row was seen in the previous 45 minutes */
export function wasRowVeryRecentlySeen(card1: Card) {
  return wasRowSeenMoreRecentlyThan(card1, 45 * minutes);
}

/**
 * Input is a time span but not a timestamp, e.g. "was card1 seen in the last
 * day?".
 */
export function wasRowSeenMoreRecentlyThan(card1: Card, time: Milliseconds) {
  const i = timeSinceRowWasSeen(card1);
  return i && i < time;
}

export function isNewRow(card1: Card): boolean {
  return !getRowLastSeen(card1);
}

export function isNewCard(card1: Card): boolean {
  return !card1.score;
}

/**
 * Used by the interface ({@link CardElement}) to indicate a card being new.
 */
export function isNewRowThatHasNotBeenSeenInSession(card1: Card): boolean {
  return card1.row.cards.every(
    (card2) =>
      isNewCard(card2) && !getAsCardInSession(card2)?.hasBeenSeenInSession,
  );
}
