import { hour, day } from 'app/App/functions/time.js'
import _ from 'underscore'
let CARDS_TO_CREATE = 30
let DEFAULT_NEW_CARDS_PER_SESSION = 3

/**
 * @memberof Deck
 */
export default function createCards(options) {
  const deck = this
  const forbidden_ids = (options && options.forbidden_ids) || []
  const now = (new Date()).getTime()

  /* Previously seen cards */
  let overdue_ids = []
  let not_overdue_bad_cards_ids = []
  let scheduled = Object.keys(deck.schedule)
    .filter(id => !forbidden_ids.includes(id))
    .map(id => ({ id, ...this.schedule[id] }))
    .sort((a, b) => a.due - b.due)
    .forEach(i => {
      if (i.last_seen > now - 6 * hour) return;
      // console.log(`${prettyPrintTimestamp(i.due)} - ${deck.cards[i.id].is}`)
      if (i.due < now + 0.5 * day) {
        overdue_ids.push(i.id)
      } else if (i.score <= 1.2) {
        not_overdue_bad_cards_ids.push(i.id)
      }
    })
  // console.log(`${overdue_ids.length} overdue`)

  /*
   * Fill an array of chosen cards.
   * If the overdue cards are not sufficiently many, the rest will be filled with low-scoring cards
   */
  let chosen_ids = [
    ..._.shuffle(overdue_ids).slice(0, CARDS_TO_CREATE - DEFAULT_NEW_CARDS_PER_SESSION),
    ..._.shuffle(not_overdue_bad_cards_ids).slice(0, 5),
  ].slice(0, CARDS_TO_CREATE - DEFAULT_NEW_CARDS_PER_SESSION)

  /* New cards */
  let new_cards_to_add = Math.max(DEFAULT_NEW_CARDS_PER_SESSION, CARDS_TO_CREATE - chosen_ids.length)
  let new_card_ids = [];
  for (let i = 0; i < deck.cards_sorted.length; i++) {
    const id = deck.cards_sorted[i].id
    if (forbidden_ids.includes(id)) continue;
    if (
      chosen_ids.length + new_card_ids.length < 15 &&
      new_card_ids.length < new_cards_to_add
    ) {
      if (!(id in deck.schedule)) {
        new_card_ids.push(id)
      }
    } else {
      break;
    }
  }

  /* Interleave new cards with old cards */
  const ratio = chosen_ids.length / new_card_ids.length
  new_card_ids.forEach((id, index) => {
    /* Inserts item at correct ratio to spread new and old cards out. */
    chosen_ids.splice(
      Math.round(ratio * index) +
      index + /* To make up for the cards we've already added */
      1, /* Plus one to make old cards show up first */
      0, id
    )
  })

  /* Related cards */
  // chosen


  /* Depends on cards */
  // TODO
  //
  let chosen = chosen_ids.map(id => ({ id, ...deck.cards[id] }))
  // console.log(chosen_ids)
  return chosen
}
