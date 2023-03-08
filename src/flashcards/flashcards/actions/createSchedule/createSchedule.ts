import { store } from "flashcards/store";
import { setSchedule } from "flashcards/flashcards/actions/card/cardSchedule";
import {
  didAnySiblingCardsGetABadRatingInThisSession,
  getSiblingCards,
} from "flashcards/flashcards/actions/card/cardSiblings";
import { wasSeenInSession } from "flashcards/flashcards/actions/card/functions";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { printWord } from "flashcards/flashcards/actions/functions";
import { Rating, Score } from "flashcards/flashcards/types";
import { log } from "modules/log";
import { addSomeRandomness, average, clamp, toFixedFloat } from "modules/math";
import { Days, daysFromNowToTimestamp, getTime, msToDays } from "modules/time";

export const SCORE_IS_INCREMENTED_BY_HOW_MUCH_IF_RATED_GOOD_OR_EASY = 0.4;

/** Multiplies the last dueInDays by this factor. */
const GOOD_MULTIPLIER = 2;
const EASY_MULTIPLIER = 4;

const BAD_INITIAL_DUE_IN_DAYS = 0.5;
const GOOD_INITIAL_DUE_IN_DAYS = 5;

/**
 * Long-row scheduling. Calculates:
 *
 * - When a card should be shown again
 * - Its score ({@see Score}).
 */
export function createSchedule() {
  const session = store.session;
  if (!session.cards?.some((i) => i.hasBeenSeenInSession)) return;

  console.group("Schedule");
  let debugData: {
    rowId: string;
    word: string;
    score: number;
    dueInDays: number;
  }[] = [];
  session.cards.forEach((card: CardInSession) => {
    let dueInDays: Days = 1;
    const prevScore = card.score;
    const sessionsSeen = card.sessionsSeen;
    const isNew = !prevScore;
    const sessionHistory = card.ratingHistory;
    if (sessionHistory.length === 0) return;
    const avgRating = average(sessionHistory);
    const lastIntervalInDays = card.lastIntervalInDays || 0;
    const lastSeen = card.lastSeen;
    const badCount = sessionHistory.filter((i) => i === Rating.BAD).length;
    const anyBad = badCount > 0;

    let score: Score = prevScore || avgRating;

    /** Calculate score */
    if (isNew) {
      if (anyBad) {
        score = Rating.BAD;
      } else {
        score = avgRating;
      }
    } else {
      if (anyBad) {
        score = Rating.BAD;
      } else {
        score = clamp(
          score + SCORE_IS_INCREMENTED_BY_HOW_MUCH_IF_RATED_GOOD_OR_EASY,
          Rating.BAD,
          Rating.EASY + 1,
        );
      }
    }

    /** Calculate dueInDays */
    if (anyBad) {
      dueInDays = BAD_INITIAL_DUE_IN_DAYS;
    } else if (isNew) {
      if (avgRating === Rating.EASY) {
        dueInDays = 40;
      } else if (avgRating === Rating.GOOD) {
        dueInDays = GOOD_INITIAL_DUE_IN_DAYS;
      }
    } else {
      const multiplier =
        avgRating === Rating.EASY ? EASY_MULTIPLIER : GOOD_MULTIPLIER;
      /** If we showed the item far in advance of the scheduled due date */
      const actualIntervalInDays = msToDays(getTime() - lastSeen!);
      if (actualIntervalInDays < lastIntervalInDays) {
        dueInDays = Math.max(
          actualIntervalInDays * multiplier,
          lastIntervalInDays,
        );

        log(
          `${printWord(card)} - given ${dueInDays} instead of ${
            (lastIntervalInDays || 1) * multiplier
          }`,
        );
      } else {
        dueInDays = (lastIntervalInDays || 1) * multiplier;
      }
    }

    /**
     * If any sibling cards got a bad rating in _this_ session, then it gets the
     * same score and due-in-days as last time.
     */
    if (
      avgRating >= Rating.GOOD &&
      didAnySiblingCardsGetABadRatingInThisSession(card)
    ) {
      if (isNew) {
        dueInDays = Math.min(3, dueInDays);
        score =
          Rating.BAD + SCORE_IS_INCREMENTED_BY_HOW_MUCH_IF_RATED_GOOD_OR_EASY;
      } else {
        dueInDays = lastIntervalInDays;
        score = prevScore;
      }
      log(
        `${printWord(
          card,
        )} given a low score due to siblings having gotten a bad rating`,
      );
    }

    setSchedule(card, {
      /** Randomly add or subtract up to 10% of the dueInDays just for some variety */
      dueAt: daysFromNowToTimestamp(addSomeRandomness(dueInDays)),
      lastIntervalInDays: toFixedFloat(dueInDays, 1),
      score: toFixedFloat(score, 2),
      lastSeen: getTime(),
      sessionsSeen: sessionsSeen + 1,
      ...(anyBad
        ? {
            lastBadTimestamp: getTime(),
            numberOfBadSessions: card.numberOfBadSessions + 1,
          }
        : {}),
    });

    debugData.push({
      rowId: card.rowId,
      word: printWord(card)!,
      score: toFixedFloat(score, 2),
      dueInDays: toFixedFloat(dueInDays, 1),
    });

    /* Postpone siblings (i.e. the other side of the card */
    getSiblingCards(card)
      /* Ignore cards that were seen in this session */
      .filter((siblingCard) => !wasSeenInSession(siblingCard))
      .forEach((siblingCard) => {
        /* Postpone based on a portion of the main card's dueInDays,
           but never more than 10 days */
        const newDue = daysFromNowToTimestamp(Math.min(dueInDays * 0.8, 10));
        const actualDue = siblingCard.dueAt;
        if (!actualDue || actualDue < newDue) {
          setSchedule(siblingCard, {
            dueAt: newDue,
          });
          log(`${printWord(siblingCard)} postponed`);
        }
      });
  });
  console.table(debugData.sort((a, b) => a.rowId.localeCompare(b.rowId)));
  console.groupEnd();
}
