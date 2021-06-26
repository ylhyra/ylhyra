import _ from "underscore";
import { hour, day } from "app/App/functions/time";
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

      /* TODO: Relative to actual interval */
      due_in_days = (card.last_interval_in_days || 1) * multiplier;
    }
    const due = new Date().getTime() + daysToMs(due_in_days);
    deck.schedule[card.id] = {
      due,
      adjusted_due: due,
      last_interval_in_days: Math.round(due_in_days),
      score,
      last_seen: new Date().getTime(),
      sessions_seen: (card.sessions_seen || 0) + 1,
    };
  });

  spread_out(deck);

  deck.syncSchedule();
};

const MAX_CARDS_PER_DAY = 100;
const spread_out = (deck) => {
  const now = new Date().getTime();
  const { schedule } = deck;
  // let minRequiredDays = Math.ceil(
  //   Object.keys(schedule).length / MAX_CARDS_PER_DAY
  // );
  let maxDays = 0;
  /* Buckets for each day relative to today */
  const buckets = {};
  const addToBucket = (days, card_id) => {
    if (!buckets[days]) buckets[days] = [];
    buckets[days].push(card_id);
  };
  for (const card_id in schedule) {
    const due = schedule[card_id].adjusted_due;
    const days = Math.max(0, Math.round((due - now) / day));
    addToBucket(days, card_id);
    maxDays = Math.max(days, maxDays);
  }
  let newBuckets = [];
  /* Fill buckets */
  for (let i = 0; i <= maxDays; i++) {
    newBuckets[i] = buckets[i] || [];
  }
  /* Spread out */
  while (newBuckets.some((i) => i.length > MAX_CARDS_PER_DAY)) {
    for (let i = 0; i < newBuckets.length; i++) {
      if (newBuckets[i].length <= MAX_CARDS_PER_DAY) continue;
      const arr = _.shuffle(newBuckets[i]);
    }
  }
};
