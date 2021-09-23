import {
  addSomeRandomness,
  average,
  clamp,
  roundToSignificantDigits,
} from "app/app/functions/math";
import { daysToMs, getTime, msToDays } from "app/app/functions/time";
import { BAD, EASY, GOOD } from "app/vocabulary/actions/cardInSession";
import { log } from "app/app/functions/log";

/**
 * @typedef {Object} ScheduleData
 * @typedef {TimestampInMilliseconds} due
 * @typedef {Days} last_interval_in_days
 * @typedef {number} score
 * @typedef {TimestampInMilliseconds} last_seen
 * @typedef {number} sessions_seen
 */

/** Increment score by how much? */
export const INCR = 0.4;

/**
 * Long-term scheduling
 * @memberOf Session#
 */
export function createSchedule() {
  const session = this;
  if (!session) {
    console.error("createSchedule called without an active session!");
    return;
  }
  if (!session.cards?.some((i) => i.hasBeenSeenInSession())) return;

  session.cards.forEach((card) => {
    let due_in_days;
    const prevScore = card.getScore();
    const sessions_seen = card.getSessionsSeen();
    const isNew = !prevScore;
    const sessionHistory = card.history;
    if (sessionHistory.length === 0) return;
    const avgRating = average(sessionHistory);
    const last_interval_in_days = card.getLastIntervalInDays();
    const last_seen = card.getLastSeen();
    const badCount = sessionHistory.filter((i) => i === BAD).length;
    const anyBad = badCount > 0;

    let score = prevScore || avgRating;

    /* SCORE */
    if (isNew) {
      if (anyBad) {
        score = BAD;
      } else {
        score = avgRating; //- 0.05;
      }
    } else {
      if (anyBad) {
        score = BAD;
      } else {
        score = clamp(score + INCR, BAD, EASY + 1);
      }
    }

    /* SCHEDULE */
    if (anyBad) {
      due_in_days = 1;
    } else if (isNew) {
      if (avgRating === EASY) {
        due_in_days = 40;
      } else if (avgRating === GOOD) {
        due_in_days = 3;
      }
    } else {
      const multiplier = avgRating === EASY ? 6 : 2;
      due_in_days = (last_interval_in_days || 1) * multiplier;

      /*
        If we showed the item far in advance of the scheduled due date,
        then we give the user the same interval as last time
      */
      const actual_interval_in_days = msToDays(getTime() - last_seen);
      if (actual_interval_in_days / last_interval_in_days < 0.3) {
        const new_due_in_days = last_interval_in_days;
        log(
          `${card.printWord()} - given ${new_due_in_days} instead of ${due_in_days}`
        );
        due_in_days = new_due_in_days;
      }
    }

    /**
     * If any sibling cards got a bad rating in this session,
     * this card can not be given a good score
     */
    if (score >= GOOD && card.didAnySiblingCardsGetABadRatingInThisSession()) {
      due_in_days = 1.4;
      score = BAD + INCR;
      log(
        `${card.printWord()} given a low score due to siblings having gotten a bad rating`
      );
    }

    card.setSchedule(
      /** @type ScheduleData */ {
        due: getTime() + daysToMs(addSomeRandomness(due_in_days)),
        last_interval_in_days: Math.round(due_in_days),
        score: roundToSignificantDigits(score, -2),
        last_seen: getTime(),
        sessions_seen: sessions_seen + 1,
      }
    );

    log(`${card.printWord()} - score: ${score} - days: ${due_in_days}`);

    /* Postpone siblings */
    if (!anyBad) {
      card
        .getSiblingCards()
        /* Ignore cards that were seen in this session */
        .filter(
          (sibling_card) =>
            !sibling_card.getAsCardInSession()?.hasBeenSeenInSession()
        )
        .forEach((sibling_card) => {
          /* Postpone based on a portion of the main card's due_in_days,
             but never more than 7 days */
          const newDue = getTime() + daysToMs(Math.min(due_in_days * 0.5, 7));
          const actualDue = sibling_card.getDue();
          if (!actualDue || actualDue < newDue) {
            sibling_card.setSchedule({
              due: newDue,
            });
            log(`${sibling_card.printWord()} postponed`);
          }
        });
    }
  });

  log("Schedule made");
}
