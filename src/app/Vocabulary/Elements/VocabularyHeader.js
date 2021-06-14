import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'app/Router/Link'
import Button from 'documents/Templates/Button'
import { getHash } from 'server/vocabulary/setup/functions.js'
import { InitializeSession } from 'app/Vocabulary/actions/session'
import { updateURL } from 'app/Router/actions'

class X extends Component {
  getCards = () => {
    const vocabulary_list = this.props.header_data.vocabulary
    const { deck } = this.props.vocabulary
    if (!vocabulary_list) return null;
    let cards = []
    vocabulary_list.forEach(term => {
      const h = getHash(term)
      if (h in deck.terms) {
        cards = cards.concat(deck.terms[h].cards)
      } else {
        console.warn(`"${term}" not in database`)
      }
    })

    // cards.forEach(id => {
    //   if (id in deck.schedule) {
    //     console.log(deck.cards[id].is)
    //   }
    // })
    return cards
  }
  run = () => {
    const { deck } = this.props.vocabulary
    const cards = this.getCards().map(id => deck.cards[id])
    console.log(cards)
    InitializeSession(cards, deck)
    updateURL('/vocabulary/play')
  }
  render() {
    const vocabulary_list = this.props.header_data.vocabulary
    const { deck } = this.props.vocabulary
    if (!vocabulary_list || !deck) return null;
    const cards = this.getCards()
    if (cards.length === 0) return null;
    return (<div>
      <button onClick={this.run}>Study {cards.length} cards</button>
    </div>)
  }
}
export default connect(state => ({
  vocabulary: state.vocabulary,
}))(X)
