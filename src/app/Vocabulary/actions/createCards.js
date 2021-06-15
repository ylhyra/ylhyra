import { hour, day } from 'app/App/functions/time.js'
import _ from 'underscore'
import { BAD, GOOD, EASY } from './card'
import { getWordFromId } from './_functions'
let CARDS_TO_CREATE = 100

/**
 * @memberof Deck
 */
export default function createCards(options, deck_) {
  const deck = deck_ || this
  const now = (new Date()).getTime()
  const forbidden_ids = (options && options.forbidden_ids) || []
  const allowed_card_ids = (options && options.allowed_card_ids) || null

  const ScoreByTimeSinceTermWasSeen = (id) => {
    let latest = null;
    deck.cards[id].terms.forEach(term => {
      deck.terms[term].cards.forEach(sibling_card_id => {
        if (deck.schedule[sibling_card_id]) {
          if (deck.schedule[sibling_card_id].last_seen > latest) {
            latest = deck.schedule[sibling_card_id].last_seen
          }
        }
      })
    })
    let hoursSinceSeen = (now - latest) / hour
    if (hoursSinceSeen < 0.3) {
      return 3
    } else if (hoursSinceSeen < 2) {
      return 2
    } else if (hoursSinceSeen < 12) {
      return 1
    } else {
      return 0
    }
    // return hoursSinceSeen
  }
  const SortIdsByWhetherTermWasRecentlySeen = (input) => {
    return input.map(id => ({
      id,
      hours_since_seen_score: ScoreByTimeSinceTermWasSeen(id),
    })).sort((a, b) => a.hours_since_seen_score - b.hours_since_seen_score).map(i => i.id)
  }

  /* Previously seen cards */
  let overdue_ids = []
  let not_overdue_bad_cards_ids = []
  let scheduled = Object.keys(deck.schedule)
    .filter(id => !forbidden_ids.includes(id))
    .filter(id => !allowed_card_ids || allowed_card_ids.includes(id))
    .map(id => ({ id, ...deck.schedule[id] }))
    .sort((a, b) => a.due - b.due)
    .forEach(i => {
      if (i.due < now + 0.5 * day) {
        overdue_ids.push(i.id)
      } else if (i.score <= 1.2) {
        not_overdue_bad_cards_ids.push(i.id)
      }
    })

  /* New cards */
  let new_card_ids = [];
  for (let i = 0; i < deck.cards_sorted.length; i++) {
    const id = deck.cards_sorted[i].id
    if (forbidden_ids.includes(id)) continue;
    if (allowed_card_ids && !allowed_card_ids.includes(id)) continue;
    if (new_card_ids.length < 50) {
      if (!(id in deck.schedule)) {
        new_card_ids.push(id)
      }
    } else {
      break;
    }
  }

  // /* Verify ids exist */
  // chosen_ids.forEach(id => {
  //   if (!(id in deck.cards)) {
  //     if (process.env.NODE_ENV === 'development') {
  //       throw new Error(`Incorrect id passed into deck.cards: ${id}`)
  //     }
  //     return null;
  //   }
  // })

  /* TODO: Not very efficient */
  overdue_ids = _.shuffle(overdue_ids)
  not_overdue_bad_cards_ids = _.shuffle(not_overdue_bad_cards_ids)
  let total_options = overdue_ids.length + not_overdue_bad_cards_ids.length + new_card_ids.length
  let chosen_ids = []
  for (let i = 0; chosen_ids.length < total_options; i++) {
    if (i % 1 === 0 && overdue_ids.length > 0) {
      chosen_ids.push(overdue_ids.shift())
    }
    if (i % 8 === 0 && not_overdue_bad_cards_ids.length > 0) {
      chosen_ids.push(not_overdue_bad_cards_ids.shift())
    }
    if (i % 9 === 0 && new_card_ids.length > 0) {
      chosen_ids.push(new_card_ids.shift())
    }
  }
  // console.log({
  //   overdue_ids: overdue_ids.map(getWordFromId),
  //   not_overdue_bad_cards_ids: not_overdue_bad_cards_ids.map(getWordFromId),
  //   new_card_ids: new_card_ids.map(getWordFromId),
  // })
  chosen_ids = SortIdsByWhetherTermWasRecentlySeen(chosen_ids)
  chosen_ids = chosen_ids.slice(0, CARDS_TO_CREATE)


  /* TODO: Related cards */

  /* Depends on cards */
  chosen_ids = _.flatten(
    chosen_ids.map(id => {
      let output = [id]
      deck.cards[id].terms.forEach(term => {
        deck.terms[term].cards
          .filter(sibling_card_id => sibling_card_id !== id)
          .forEach(sibling_card_id => {
            if (
              /* Not seen */
              !(sibling_card_id in deck.schedule) ||
              deck.schedule[sibling_card_id].score < GOOD
            ) {
              output.push(sibling_card_id)
            }
          })
      })
      /* Show Icelandic card before English */
      output = output.sort((a, b) => {
        if (a.endsWith('is')) return -1;
        return 1;
      })
      return output
    })
  )

  let chosen = _.uniq(chosen_ids).map(id => {
    return { id, ...deck.cards[id] }
  }).filter(Boolean)
  return chosen
}
