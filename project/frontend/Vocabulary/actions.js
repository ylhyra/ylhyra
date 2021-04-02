import store from 'App/store'
import cards_data from './TestData'

export const BAD = 1
export const OK = 2
export const PERFECT = 3

let counter = 0
let lastSeenBelongsTo = {}
let currentCard = null

/*

  status - Status of card in the current study session, shown in progress bar
*/
class Card {
  constructor(data) {
    Object.assign(this, data)
    this.rating = null
    this.ratingHistoryForSession = []
  }
  get() {
    return this.data
  }
  rate(rating) {
    this.ratingHistoryForSession.unshift(rating)
    this.lastSeen = counter

    this.status = rating
    this.rating = average(this.ratingHistoryForSession.slice(0, 2))

    let next;
    if (rating === BAD) {
      next = 3
    } else if (rating === OK) {
      next = 8
    } else if (rating === PERFECT) {
      next = 16
    }
    this.nextShow = counter + next
    // if(this.ratingHistoryForSession.slice(0, 2))
  }
  getRanking() {
    let ranking = this.rating || OK
    const ticksSinceSeen = counter - lastSeenBelongsTo[this.belongs_to]
    if (ticksSinceSeen < 4) {
      return ranking + 100;
    }
    if (this.done) {
      return ranking + 30
    }
    return ranking
  }
  getStatus() {
    if (!this.lastSeen) return null;
    return this.status
  }
}

class Deck {
  constructor(cards) {
    this.history = []
    this.cards = {}
    // let id_to_card = {}
    // cards_input.forEach(card => {
    //   id_to_card[card.id] = card
    // })
    this.cards = cards.map(card => new Card(card))
    this.next()
    // /* New cards must be studied in the correct order */
    // this.newCards = this.cards.filter(card => card.isNew())
    //
    // /* A maximum of 5 cards are under intensive study */
    // this.intensiveStudy = []
  }
  getCard() {
    return currentCard
  }
  rateCard(rating) {
    currentCard.rate(rating, counter)
  }
  next() {
    currentCard = this.cards.sort((a, b) => a.getRanking() - b.getRanking())[0]
    counter++;
    lastSeenBelongsTo[currentCard.belongs_to] = counter
    // console.log(currentCard)
    console.log(this.cards
      .sort((a, b) => a.rating - b.rating)
      .map(i => `${i.rating}\t${i.from==='is'?i.is:i.en}`)
      .join('\n')
    )
  }
  getStatus() {
    return {
      bad: this.cards.filter(card => card.getStatus() === BAD).length,
      ok: this.cards.filter(card => card.getStatus() === OK).length,
      good: this.cards.filter(card => card.getStatus() === PERFECT).length,
      total: this.cards.filter(card => card.done).length,
    }
  }
}

const deck = new Deck(cards_data)


export const load = () => {
  store.dispatch({
    type: 'LOAD_CARD',
    content: {
      ...deck.getCard(),
      counter: deck.counter,
      status: deck.getStatus(),
    }
  })
}

export const answer = (rating) => {
  deck.rateCard(rating)
  deck.next()
  load()
}

// export const next = (input) => {
//   store.dispatch({
//     type: 'LOAD_CARD',
//     content: test_data[1]
//   })
// }


const average = (arr) => {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length
}
