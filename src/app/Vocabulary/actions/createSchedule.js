import { average, clamp } from "app/App/functions/math";
import store from "app/App/store";
import { BAD, GOOD, EASY } from "./card";
import { daysToMs } from "app/App/functions/time";

/*
  Long-term scheduling
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
    let prevScore = card.score;
    let isNew = !prevScore;
    const sessionHistory = card.history;
    if (sessionHistory.length === 0) return;
    const sessionScore = average(sessionHistory);
    const anyBad = sessionHistory.some((i) => i === BAD);
    // const badGoodRatio =
    //   sessionHistory.filter((i) => i === BAD) /
    //   sessionHistory.filter((i) => i >= GOOD);

    /* SCORE */
    if (isNew) {
      if (anyBad) {
        score = 1;
      } else {
        score = sessionScore - 0.25;
      }
    } else {
      if (anyBad) {
        if (anyBad > 1) {
          score = BAD;
        } else {
          score = clamp(prevScore - 0.25, BAD, BAD + 0.75);
        }
      } else {
        score = clamp(prevScore + 0.25, BAD, EASY + 1);
      }
    }

    /* SCHEDULE */
    if (anyBad) {
      due_in_days = 1;
    } else if (isNew) {
      if (sessionScore === EASY) {
        due_in_days = 20;
      } else if (sessionScore === GOOD) {
        due_in_days = 3;
      }
    } else {
      const multiplier = sessionScore === EASY ? 6 : 2;
      due_in_days = (card.last_interval_in_days || 1) * multiplier;
    }

    deck.schedule[card.id] = {
      due: new Date().getTime() + daysToMs(due_in_days),
      last_interval_in_days: Math.round(due_in_days),
      score,
      last_seen: new Date().getTime(),
      sessions_seen: (card.sessions_seen || 0) + 1,
    };
  });

  deck.syncSchedule();
};
