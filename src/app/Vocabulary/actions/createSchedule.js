import { printWord, getCardsWithSameTerm } from "./functions";
import { BAD, GOOD, EASY } from "./card";
import { daysToMs, msToDays, hours } from "app/App/functions/time";
import { average, clamp, mapValueToRange, round } from "app/App/functions/math";
import { sync } from "app/Vocabulary/actions/sync.js";

/* Increment score by how much? */
export const INCR = 0.4;

/**
 * Long-term scheduling
 * @memberof Session
 */
export function createSchedule() {
  const session = this;
  const deck = this.deck;
  if (!session) {
    console.error("createSchedule called without an active session!");
    return;
  }
  const cards = session.cards;
  if (!cards || !cards.some((i) => i.history.length > 0)) return;

  cards.forEach((card) => {
    let due_in_days;
    let prevScore = deck.schedule[card.id]?.score;
    let sessions_seen = deck.schedule[card.id]?.sessions_seen;
    let isNew = !prevScore;
    const sessionHistory = card.history;
    if (sessionHistory.length === 0) return;
    const avgRating = average(sessionHistory);
    const last_interval_in_days = deck.schedule[card.id]?.last_interval_in_days;
    const last_seen = deck.schedule[card.id]?.last_seen;
    const badCount = sessionHistory.filter((i) => i === BAD).length;
    const anyBad = badCount > 0;
    const now = new Date().getTime();

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
      const actual_interval_in_days = msToDays(now - last_seen);
      if (actual_interval_in_days / last_interval_in_days < 0.3) {
        const new_due_in_days = last_interval_in_days;
        process.env.NODE_ENV === "development" &&
          console.warn(
            `${printWord(
              card.id
            )} - given ${new_due_in_days} instead of ${due_in_days}`
          );
        due_in_days = new_due_in_days;
      }
    }
    let due = now + daysToMs(due_in_days);
    /* Add some randomness to large intervals */
    if (due_in_days > 20) {
      due += daysToMs(Math.random() * 3);
    }
    deck.schedule[card.id] = {
      due,
      last_interval_in_days: Math.round(due_in_days),
      score: Math.round(score * 100) / 100,
      last_seen: new Date().getTime(),
      sessions_seen: (sessions_seen || 0) + 1,
      needsSyncing: true,
    };

    process.env.NODE_ENV === "development" &&
      console.log(
        `${printWord(card.id)} - score: ${score} - days: ${due_in_days}`
      );

    /* Postpone siblings */
    if (!anyBad) {
      getCardsWithSameTerm(card.id)
        .filter(
          (id) =>
            id !== card.id &&
            !cards.some((j) => j.id === id && j.history.length > 0)
        )
        .forEach((sibling_card_id) => {
          // console.log(printWord(sibling_card_id));
          const newDue = now + daysToMs(Math.min(due_in_days * 0.5, 7));
          const actualDue = deck.schedule[sibling_card_id]?.due;
          if (!actualDue || actualDue < newDue) {
            deck.schedule[sibling_card_id] = {
              ...(deck.schedule[sibling_card_id] || {}),
              due: newDue,
              needsSyncing: true,
            };
          }
          process.env.NODE_ENV === "development" &&
            console.log(`${printWord(sibling_card_id)} postponed`);
        });
    }
  });

  console.log("Schedule made");
  this.saveSessionLog();
  sync();
}
