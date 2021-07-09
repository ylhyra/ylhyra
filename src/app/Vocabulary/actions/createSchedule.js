import _ from "underscore";
import { hour, day } from "app/App/functions/time";
import { average, clamp } from "app/App/functions/math";
import store from "app/App/store";
import { BAD, GOOD, EASY } from "./card";
import { daysToMs } from "app/App/functions/time";
const MAX_CARDS_PER_DAY = 100;

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
  deck.spreadOutSchedule();

  cards.forEach((card) => {
    let due_in_days;
    let due_in_days_adjusted;
    let score;
    let prevScore = card.score;
    let isNew = !prevScore;
    const sessionHistory = card.history;
    if (sessionHistory.length === 0) return;
    const sessionScore = average(sessionHistory);
    const badCount = sessionHistory.filter((i) => i === BAD).length;
    const anyBad = badCount > 0;
    const now = new Date().getTime();

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
      if (badCount === 1) {
        due_in_days_adjusted = 2.5;
      }
    } else if (isNew) {
      if (sessionScore === EASY) {
        due_in_days = 20;
        due_in_days_adjusted = 100;
      } else if (sessionScore === GOOD) {
        due_in_days = 3;
        due_in_days_adjusted = 6;
      }
    } else {
      const multiplier = sessionScore === EASY ? 6 : 2;

      /* TODO: Relative to actual interval */
      due_in_days = (card.last_interval_in_days || 1) * multiplier;
    }
    const due = now + daysToMs(due_in_days);
    const adjusted_due = now + daysToMs(due_in_days_adjusted || due_in_days);
    deck.schedule[card.id] = {
      due,
      adjusted_due,
      last_interval_in_days: Math.round(due_in_days),
      score,
      last_seen: new Date().getTime(),
      sessions_seen: (card.sessions_seen || 0) + 1,
      needsSyncing: true,
    };
  });

  deck.spreadOutSchedule();
  deck.syncSchedule();
};

export async function spreadOutSchedule() {
  const { schedule } = this;
  const now = new Date().getTime();
  let maxDays = 0;
  /* Buckets for each day relative to today */
  const tmp_buckets = {};
  for (const card_id in schedule) {
    const due = schedule[card_id].adjusted_due;
    const days = Math.max(0, Math.round((due - now) / day));
    if (!tmp_buckets[days]) tmp_buckets[days] = [];
    tmp_buckets[days].push(card_id);
    maxDays = Math.max(days, maxDays);
  }
  let buckets = [];
  /* Fill buckets */
  for (let i = 0; i <= maxDays; i++) {
    buckets[i] = tmp_buckets[i] || [];
  }
  /* Spread out */
  while (buckets.some((i) => i.length > MAX_CARDS_PER_DAY)) {
    for (let i = 0; i < buckets.length; i++) {
      if (buckets[i].length <= MAX_CARDS_PER_DAY) continue;
      const arr = _.shuffle(buckets[i]);
      const will_remain = arr.slice(0, MAX_CARDS_PER_DAY);
      const will_move = arr.slice(MAX_CARDS_PER_DAY);
      /* Max 10% will be moved back */
      let howManyWillMoveBack = 0;
      if (i > 0 && buckets[i - 1].length > MAX_CARDS_PER_DAY) {
        howManyWillMoveBack = Math.min(
          buckets[i - 1].length - MAX_CARDS_PER_DAY,
          Math.floor(will_move.length * 0.1)
        );
      }
      const will_move_back = will_move.slice(0, howManyWillMoveBack);
      const will_move_forward = will_move.slice(howManyWillMoveBack);
      if (howManyWillMoveBack > 0) {
        buckets[i - 1] = [...buckets[i - 1], ...will_move_back];
      }
      buckets[i] = will_remain;
      buckets[i + 1] = [...(buckets[i + 1] || []), ...will_move_forward];
    }
  }
  /* Save after having spread out */
  for (let new_days in buckets) {
    buckets[new_days].forEach((card_id) => {
      const due = schedule[card_id].adjusted_due;
      const days = Math.max(0, Math.round((due - now) / day));
      if (Math.abs(days - new_days) > 1) {
        schedule[card_id].adjusted_due = now + new_days * day;
        schedule[card_id].needsSyncing = true;
      }
    });
  }
}
