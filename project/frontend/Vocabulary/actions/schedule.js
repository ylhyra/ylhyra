import { average, clamp } from 'App/functions/math'
import store from 'App/store'
import { BAD, OK, PERFECT } from './card'

// export const CARD_STATUS_LEARNING = 'learning'
// export const CARD_STATUS_LEARNED = 'learned'

/**
 * Long-term scheduling
 */
export const getNewSchedule = () => {
  const cards = store.getState().vocabulary.session.cards

  const newSchedule = cards.map(card => {
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

    return {
      id: card.id,
      due_in_days,
      score,
    }
  })

  return newSchedule
}
