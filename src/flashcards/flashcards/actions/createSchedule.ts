import { wasSeenInSession } from "flashcards/flashcards/actions/card/card";
import {
  getDue,
  getLastIntervalInDays,
  getLastSeen,
  getNumberOfBadSessions,
  getScore,
  getSessionsSeen,
  setSchedule,
} from "flashcards/flashcards/actions/card/card_schedule";
import {
  didAnySiblingCardsGetABadRatingInThisSession,
  getSiblingCards,
} from "flashcards/flashcards/actions/card/card_siblings";
import CardInSession from "flashcards/flashcards/actions/cardInSession";
import { printWord } from "flashcards/flashcards/actions/functions";
import { getSession } from "flashcards/flashcards/sessionStore";
import { Rating } from "flashcards/flashcards/types/types";
import { log } from "modules/log";
import { addSomeRandomness, average, clamp, toFixedFloat } from "modules/math";
import { Days, daysFromNowToTimestamp, getTime, msToDays } from "modules/time";

/** Increment score by how much? */
export const INCR = 0.4;

const EASY_MULTIPLIER = 7;
const GOOD_MULTIPLIER = 2.5;

const BAD_INITIAL_INTERVAL = 1.3;
const GOOD_INITIAL_INTERVAL = 5;

/**
 * Long-term scheduling
 */
export function createSchedule() {
  const session = getSession();
  if (!session) {
    console.error("createSchedule called without an active session!");
    return;
  }
  if (!session.cards?.some((i) => i.hasBeenSeenInSession())) return;

  session.cards.forEach((card: CardInSession) => {
    let dueInDays: Days = 1;
    const id = card.getId();
    const prevScore = getScore(id);
    const sessionsSeen = getSessionsSeen(id);
    const isNew = !prevScore;
    const sessionHistory = card.history;
    if (sessionHistory.length === 0) return;
    const avgRating = average(sessionHistory);
    const lastIntervalInDays = getLastIntervalInDays(id);
    const lastSeen = getLastSeen(id);
    const badCount = sessionHistory.filter((i) => i === Rating.BAD).length;
    const anyBad = badCount > 0;

    let score = prevScore || avgRating;

    /* SCORE */
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
        score = clamp(score + INCR, Rating.BAD, Rating.EASY + 1);
      }
    }

    /* SCHEDULE */
    if (anyBad) {
      dueInDays = BAD_INITIAL_INTERVAL;
    } else if (isNew) {
      if (avgRating === Rating.EASY) {
        dueInDays = 40;
      } else if (avgRating === Rating.GOOD) {
        dueInDays = GOOD_INITIAL_INTERVAL;
      }
    } else {
      const multiplier =
        avgRating === Rating.EASY ? EASY_MULTIPLIER : GOOD_MULTIPLIER;
      dueInDays = (lastIntervalInDays || 1) * multiplier;

      /*
        If we showed the item far in advance of the scheduled due date,
        then we give the user the same interval as last time
      */
      const actualIntervalInDays = msToDays(getTime() - lastSeen);
      if (actualIntervalInDays / lastIntervalInDays < 0.3) {
        const newDueInDays = lastIntervalInDays;
        log(
          `${printWord(
            card.getId()
          )} - given ${newDueInDays} instead of ${dueInDays}`
        );
        dueInDays = newDueInDays;
      }
    }

    /**
     * If any sibling cards got a bad rating in this session,
     * this card can not be given a good score
     */
    if (
      score >= Rating.GOOD &&
      didAnySiblingCardsGetABadRatingInThisSession(id)
    ) {
      dueInDays = Math.min(2, dueInDays);
      score = Math.min(Rating.BAD + INCR, score);
      log(
        `${printWord(
          id
        )} given a low score due to siblings having gotten a bad rating`
      );
    }

    setSchedule(card.id, {
      due: daysFromNowToTimestamp(addSomeRandomness(dueInDays)),
      last_interval_in_days: toFixedFloat(dueInDays, 1),
      score: toFixedFloat(score, 2),
      last_seen: getTime(),
      sessions_seen: sessionsSeen + 1,
      ...(anyBad
        ? {
            last_bad_timestamp: getTime(),
            number_of_bad_sessions: getNumberOfBadSessions(card.getId()) + 1,
          }
        : {}),
    });

    log(
      printWord(id),
      `score: ${toFixedFloat(score, 2)}`,
      `days: ${toFixedFloat(dueInDays, 1)}`
    );

    /* Postpone siblings */
    getSiblingCards(id)
      /* Ignore cards that were seen in this session */
      .filter((sibling_card) => !wasSeenInSession(sibling_card))
      .forEach((sibling_card) => {
        /* Postpone based on a portion of the main card's due_in_days,
           but never more than 10 days */
        const newDue = daysFromNowToTimestamp(Math.min(dueInDays * 0.8, 10));
        const actualDue = getDue(sibling_card);
        if (!actualDue || actualDue < newDue) {
          setSchedule(sibling_card, {
            due: newDue,
          });
          log(`${printWord(sibling_card)} postponed`);
        }
      });
  });

  log("Schedule made");
}
