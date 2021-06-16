import store from 'app/App/store'
/**
 * Various helper functions
 */
import Card, { BAD, GOOD, EASY } from './card'
import _ from 'underscore'
import { MAX_SECONDS_TO_COUNT_PER_ITEM } from './session'

export const getDeck = () => {
  return store.getState().vocabulary.deck
}
export const MakeSummaryOfCardStatuses = (cards, deck) => {
  let not_seen = 0
  let bad = 0
  let good = 0
  let easy = 0
  cards.forEach(id => {
    if (id in deck.schedule) {
      if (deck.schedule[id].score < GOOD) {
        bad++
      } else if (deck.schedule[id].score < EASY) {
        good++
      } else {
        easy++
      }
    } else {
      not_seen++
    }
  })
  return {
    not_seen,
    bad,
    good,
    easy,
  }
}

export const PercentageKnown = (cards, deck) => {
  const summary = MakeSummaryOfCardStatuses(cards, deck)
  let done_count = summary.good + summary.easy * 1 + summary.bad * 1
  let remaining_count = summary.not_seen * 1 + summary.bad * 2
  let percentage = Math.ceil((done_count / (remaining_count + done_count)) * 100)
  if (percentage === 100 && done_count !== remaining_count) percentage = 99;
  return percentage
}

export const getWordFromId = (id) => {
  return getDeck().cards[id].is
}

export const getRelatedCardIds = (id) => {
  const deck = getDeck()
  let out = []
  deck.cards[id].terms.forEach(term => {
    deck.terms[term].cards.forEach(sibling_card_id => {
      out.push(sibling_card_id)
    })
  })
  return out
}
