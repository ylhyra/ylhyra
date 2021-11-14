import {
  addSomeRandomness,
  average,
  clamp,
  toFixedFloat,
} from "app/app/functions/math";
import { getTime, inDays, msToDays } from "app/app/functions/time";
import { log } from "app/app/functions/log";
import { BAD, EASY, GOOD } from "app/vocabulary/actions/card/card_difficulty";
import {
  getDue,
  getLastIntervalInDays,
  getLastSeen,
  getScore,
  getSessionsSeen,
  setSchedule,
} from "app/vocabulary/actions/card/card_schedule";
import { getSiblingCards } from "app/vocabulary/actions/card/card_siblings";
import { printWord } from "./functions";
import { wasSeenInSession } from "app/vocabulary/actions/card/card";

/** Increment score by how much? */
export const INCR = 0.4;

const EASY_MULTIPLIER = 7;
const GOOD_MULTIPLIER = 2.5;

const BAD_INITIAL_INTERVAL = 1.3;
const GOOD_INITIAL_INTERVAL = 5;

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
    const prevScore = getScore(card);
    const sessions_seen = getSessionsSeen(card);
    const isNew = !prevScore;
    const sessionHistory = card.history;
    if (sessionHistory.length === 0) return;
    const avgRating = average(sessionHistory);
    const last_interval_in_days = getLastIntervalInDays(card);
    const last_seen = getLastSeen(card);
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
      due_in_days = BAD_INITIAL_INTERVAL;
    } else if (isNew) {
      if (avgRating === EASY) {
        due_in_days = 40;
      } else if (avgRating === GOOD) {
        due_in_days = GOOD_INITIAL_INTERVAL;
      }
    } else {
      const multiplier = avgRating === EASY ? EASY_MULTIPLIER : GOOD_MULTIPLIER;
      due_in_days = (last_interval_in_days || 1) * multiplier;

      /*
        If we showed the item far in advance of the scheduled due date,
        then we give the user the same interval as last time
      */
      const actual_interval_in_days = msToDays(getTime() - last_seen);
      if (actual_interval_in_days / last_interval_in_days < 0.3) {
        const new_due_in_days = last_interval_in_days;
        log(
          `${printWord(
            card
          )} - given ${new_due_in_days} instead of ${due_in_days}`
        );
        due_in_days = new_due_in_days;
      }
    }

    /**
     * If any sibling cards got a bad rating in this session,
     * this card can not be given a good score
     */
    if (score >= GOOD && card.didAnySiblingCardsGetABadRatingInThisSession()) {
      due_in_days = Math.min(2, due_in_days);
      score = Math.min(BAD + INCR, score);
      log(
        `${card.printWord()} given a low score due to siblings having gotten a bad rating`
      );
    }

    setSchedule(
      card,
      // /** @type ScheduleData */
      {
        due: inDays(addSomeRandomness(due_in_days)),
        last_interval_in_days: toFixedFloat(due_in_days, 1),
        score: toFixedFloat(score, 2),
        last_seen: getTime(),
        sessions_seen: sessions_seen + 1,
      }
    );

    log(
      `${card.printWord()} - score: ${toFixedFloat(
        score,
        2
      )} - days: ${toFixedFloat(due_in_days, 1)}`
    );

    /* Postpone siblings */
    getSiblingCards(card.getId())
      /* Ignore cards that were seen in this session */
      .filter((sibling_card) => !wasSeenInSession(sibling_card))
      .forEach((sibling_card) => {
        /* Postpone based on a portion of the main card's due_in_days,
           but never more than 10 days */
        const newDue = inDays(Math.min(due_in_days * 0.8, 10));
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
