import { average, clamp } from 'App/functions/math'
import store from 'App/store'

export const CARD_STATUS_LEARNING = 'learning'
export const CARD_STATUS_LEARNED = 'learned'

/**
 * Long-term scheduling
 */
export const getNewSchedule = () => {
  const cards = store.getState().vocabulary.session.cards

  /* An array of { id, due_in_days } */
  const newSchedule = cards.map(card => {
    return {
      id: card.id,
      due_in_days: 1,
      status: CARD_STATUS_LEARNING,
    }
  })

  return newSchedule
}
