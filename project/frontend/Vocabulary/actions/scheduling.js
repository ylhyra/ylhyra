import { average, clamp } from 'App/functions/math'
import store from 'App/store'
import { BAD, OK, PERFECT } from './card'
import { daysToMs } from 'project/frontend/App/functions/time.js'

/**
 * Long-term scheduling
 */
export const generateNewSchedule = () => {
  const deck = store.getState().vocabulary.deck
  const cards = store.getState().vocabulary.session.cards

  cards.forEach(card => {
    let due_in_days;
    let score;
    if (card.score) {
      score = average([card.score, average(card.history)])
    } else {
      score = average(card.history)
    }
    const anyBad = card.history.some(i => i === BAD)
    if (anyBad) {
      due_in_days = 1;
    } else {
      due_in_days = (card.last_interval_in_days || 1) * score
    }
    /* New cards */
    if (!card.times_seen) {
      if (score > 2.8) {
        due_in_days = 20
      }
    }

    // return {
    //   id: card.id,
    //   due_in_days,
    //   score,
    // }

    deck.schedule[card.id] = {
      due: (new Date()).getTime() + daysToMs(due_in_days),
      last_interval_in_days: due_in_days,
      score,
      last_seen: (new Date()).getTime(),
      times_seen: (deck.schedule[card.id] && deck.schedule[card.id].times_seen || 0) + 1,
    }
  })

  deck.saveSchedule()
}
