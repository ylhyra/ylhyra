/**
 * Various helper functions
 */
import Card, { BAD, GOOD, EASY } from './card'
import _ from 'underscore'
import { MAX_SECONDS_TO_COUNT_PER_ITEM } from './session'

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

/**
 * @extends Session
 */
export const updateRemainingTime = function () {
  const newTimestamp = (new Date()).getTime()
  const diff = Math.min(
    MAX_SECONDS_TO_COUNT_PER_ITEM * 1000,
    newTimestamp - this.lastTimestamp
  )
  this.remainingTime = Math.max(0, this.remainingTime - diff)
  this.lastTimestamp = newTimestamp
  if (this.remainingTime <= 0) {
    this.deck.sessionDone()
  }
}

/**
 * @extends Session
 */
export const getAdjustedPercentageDone = function () {
  return ((this.totalTime - this.remainingTime) / this.totalTime) * 100
}

/**
 * @extends Session
 */
export const printTimeRemaining = function () {
  const time = Math.floor(this.remainingTime / 1000) || 1
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return `${minutes}:${('0'+seconds).slice(-2)}`
  // return `${minutes} minute${minutes===1?'':''}, ${('0'+seconds).slice(-2)} second${seconds===1?'s':''}`
}

/**
 * @extends Session
 */
export const getCard = function () {
  return this.currentCard
}

/**
 * @extends Session
 */
export const checkIfCardsRemaining = function () {
  const areThereNewCardsRemaining = this.cards.some(i => i.history.length === 0)
  if (!areThereNewCardsRemaining) {
    this.createMoreCards()
  }
}

/**
 * @extends Session
 */
export const createMoreCards = function () {
  const newCards = this.deck.createCards({
    forbidden_ids: this.cards.map(i => i.id)
  })
  this.cards = this.cards
    .concat(newCards.map((card, index) => new Card(card, index, this)))
  console.log('New cards generated')
}

/**
 * @extends Session
 */
export const getStatus = function () {
  return {
    bad: this.cards.filter(card => card.getStatus() === BAD).length,
    good: this.cards.filter(card => card.getStatus() === GOOD).length,
    easy: this.cards.filter(card => card.getStatus() === EASY).length,
    total: this.cards.length,
    wordsTotal: _.uniq(_.flatten(this.cards.map(i => i.terms))).length,
    counter: this.counter,
  }
}
