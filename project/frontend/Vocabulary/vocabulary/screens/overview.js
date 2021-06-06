import GameContainer from 'Vocabulary/vocabulary/Elements/GameContainer'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from 'App/store'
import { MINUTES } from 'Vocabulary/vocabulary/actions/session'
import { Link } from 'react-router-dom'

export default () => (
  <div>
    <h1>Vocabulary</h1>
    {status && status.total > 0 ? <div>
      Ready to study for {MINUTES} minutes?
      <br/>
      <Link to="/vocabulary/running">
        {status.counter && status.counter > 1 ? 'Continue' : 'Start'}
      </Link>
    </div> : `Loading...`}

    <Overview/>
  </div>
)


@connect(state => ({
  vocabulary: state.vocabulary,
}))
class Overview extends Component {
  render() {
    const { deck } = this.props.vocabulary
    if (!deck) return null;
    return <div>
      {Object.keys(deck.schedule).length} seen out of total {Object.keys(deck.cards).length} cards
    </div>
  }
}
