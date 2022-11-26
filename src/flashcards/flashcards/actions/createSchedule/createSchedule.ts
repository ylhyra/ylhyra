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
const GOOD_MULTIPLIER = 2.5;
const EASY_MULTIPLIER = 7;

const BAD_INITIAL_DUE_IN_DAYS = 1.3;
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

  console.groupCollapsed("See schedule");
  session.cards.forEach((card: CardInSession) => {
    let dueInDays: Days = 1;
    const prevScore = card.score;
    const sessionsSeen = card.sessionsSeen;
    const isNew = !prevScore;
    const sessionHistory = card.ratingHistory;
    if (sessionHistory.length === 0) return;
    const avgRating = average(sessionHistory);
    const lastIntervalInDays = card.lastIntervalInDays;
    const lastSeen = card.lastSeen;
    const badCount = sessionHistory.filter((i) => i === Rating.BAD).length;
    const anyBad = badCount > 0;

    let score: Score = prevScore || avgRating;

    /**
     * SCORE
     *
     * @see Score
     */
    if (isNew) {
      if (anyBad) {
        score = Rating.BAD;
      } else {
        score = avgRating; //- 0.05;
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

    /* SCHEDULE */
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
      dueInDays = (lastIntervalInDays || 1) * multiplier;

      /*
        If we showed the item far in advance of the scheduled due date,
        then we give the user the same interval as last time
      */
      const actualIntervalInDays = msToDays(getTime() - lastSeen!);
      if (actualIntervalInDays / lastIntervalInDays! < 0.3) {
        const newDueInDays = lastIntervalInDays!;
        log(
          `${printWord(card)} - given ${newDueInDays} instead of ${dueInDays}`,
        );
        dueInDays = newDueInDays;
      }
    }

    /**
     * If any sibling cards got a bad rating in this session, then:
     *
     * - This card's score is set to "1.4".
     * - It is scheduled to be shown no later than in three days.
     */
    if (
      score >= Rating.GOOD &&
      didAnySiblingCardsGetABadRatingInThisSession(card)
    ) {
      dueInDays = Math.min(3, dueInDays);
      score =
        Rating.BAD + SCORE_IS_INCREMENTED_BY_HOW_MUCH_IF_RATED_GOOD_OR_EASY;
      log(
        `${printWord(
          card,
        )} given a low score due to siblings having gotten a bad rating`,
      );
    }

    setSchedule(card, {
      /**
       * Randomly add or subtract up to 10% of the dueInDays just for some
       * variety
       */
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

    log(
      printWord(card),
      `score: ${toFixedFloat(score, 2)}`,
      `days: ${toFixedFloat(dueInDays, 1)}`,
    );

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

  console.groupEnd();
}
