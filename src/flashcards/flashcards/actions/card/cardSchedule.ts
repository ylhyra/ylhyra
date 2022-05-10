import {Card} from "flashcards/flashcards/actions/card/card";
import {getEntireSchedule} from "flashcards/flashcards/actions/userData/userDataStore";
import {CardId, Rating, ScheduleData, Score,} from "flashcards/flashcards/types/types";
import {minIgnoreFalsy, roundMsTo100Sec} from "modules/math";
import {Days, getTimeMemoized, Milliseconds, minutes, Timestamp,} from "modules/time";

export function getScheduleForCard(this: Card): Partial<ScheduleData> | undefined {
  return getEntireSchedule()[this.cardId];
}

export function getDue(this: Card): Timestamp | undefined {
  return this.getScheduleForCard()?.due;
}

/**
 * @see Score
 */
export function getScore(this: Card): Score | undefined {
  return this.getScheduleForCard()?.score;
}

export function getSessionsSeen(this: Card): number {
  return this.getScheduleForCard()?.sessionsSeen || 0;
}

export function getNumberOfBadSessions(this: Card): number {
  return this.getScheduleForCard()?.numberOfBadSessions || 0;
}

export function getLastIntervalInDays(
  this: Card,
  id: CardId
): Days | undefined {
  return this.getScheduleForCard()?.lastIntervalInDays;
}

export function getLastSeen(this: Card): Timestamp | undefined {
  return this.getScheduleForCard()?.lastSeen;
}

export function isUnseenSiblingOfANonGoodCard(this: Card) {
  if (!this.isNewCard()) return false;
  const lowest = this.getLowestAvailableTermScore();
  return lowest && lowest < Rating.GOOD;
}

/**
 * Note that a card may be in the schedule without having been seen
 * (it may just have been postponed instead).
 */
export function isInSchedule(this: Card) {
  return this.cardId in getEntireSchedule();
}

export function setSchedule(
  this: Card,
  id: CardId,
  data: Partial<ScheduleData>
) {
  /* Round timestamps */
  ["due", "lastSeen", "lastBadTimestamp"].forEach((key) => {
    if (key in data) {
      // @ts-ignore
      data[key] = roundMsTo100Sec(data[key]);
    }
  });

  getEntireSchedule()[this.cardId] = {
    ...(getEntireSchedule()[this.cardId] || {}),
    ...data,
  };
  this.saveCardSchedule();
}

export function isUnseenTerm(this: Card) {
  return !this.getTermLastSeen();
}

export function getLowestAvailableTermScore(
  this: Card,
  id: CardId
): Score | null {
  let lowestScore: Score | null = null;
  this.getAllCardIdsWithSameTerm().forEach((card) => {
    if (card.getScore()) {
      lowestScore = minIgnoreFalsy(lowestScore, card.getScore());
    }
  });
  return lowestScore;
}

export function getTermLastSeen(this: Card): Timestamp | null {
  let max: Timestamp | null = null;
  this.getAllCardIdsWithSameTerm().forEach((card) => {
    max = Math.max(max || 0, card.getLastSeen() || 0);
  });
  return max;
}

export function timeSinceTermWasSeen(
  this: Card,
): Milliseconds | null {
  let j = id.getTermLastSeen();
  if (!j) return null;
  return getTimeMemoized() - j;
}

/**
 * Whether a term was seen in the previous 45 minutes
 */
export function wasTermVeryRecentlySeen(this: Card) {
  return id.wasTermSeenMoreRecentlyThan( 45 * minutes);
}

/**
 * Input is a time span but not a timestamp,
 * e.g. "was this seen in the last day?".
 */
export function wasTermSeenMoreRecentlyThan(
  this: Card,
  id: CardId,
  time: Milliseconds
) {
  const i = id.timeSinceTermWasSeen();
  return i && i < time;
}

export function isNewCard(this: Card): boolean {
  return !id.getScore();
}

/**
 * Primarily used by the interface ({@link CardElement})
 * to indicate a card being new.
 */
export function isNewTermThatHasNotBeenSeenInSession(
  this: Card,
  cardId: CardId
) {
  return cardId.getAllCardIdsWithSameTerm(((cardId2) => {
    return (
      cardId2.isNewCard() && !cardId2.getAsCardInSession()?.hasBeenSeenInSession()
    );
  });
}
