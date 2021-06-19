import { average, clamp } from "app/App/functions/math";
import store from "app/App/store";
import { BAD, GOOD, EASY } from "./card";
import { daysToMs } from "app/App/functions/time.js";

/**
 * Long-term scheduling
 */
export const createSchedule = () => {
  const { deck, session } = store.getState().vocabulary;
  if (!session) {
    console.error("createSchedule called without an active session!");
    return;
  }
  const cards = session.cards;

  cards.forEach((card) => {
    let due_in_days;
    let score;
    if (card.history.length === 0) return;
    if (card.score) {
      score = average([card.score, average(card.history)]);
    } else {
      score = average(card.history);
    }
    const anyBad = card.history.some((i) => i === BAD);
    if (anyBad) {
      due_in_days = 1;
    } else {
      due_in_days = (card.last_interval_in_days || 1) * score;
    }
    /* New cards */
    if (!card.sessions_seen) {
      if (score > 2.8) {
        due_in_days = 20;
      }
    }

    // return {
    //   id: card.id,
    //   due_in_days,
    //   score,
    // }

    deck.schedule[card.id] = {
      due: new Date().getTime() + daysToMs(due_in_days),
      last_interval_in_days: due_in_days,
      score,
      last_seen: new Date().getTime(),
      sessions_seen:
        ((deck.schedule[card.id] && deck.schedule[card.id].sessions_seen) ||
          0) + 1,
    };
  });

  deck.syncSchedule();
};
