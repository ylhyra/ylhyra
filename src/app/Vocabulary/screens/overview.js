import GameContainer from 'app/Vocabulary/Elements/GameContainer'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from 'app/App/store'
import { MINUTES } from 'app/Vocabulary/actions/session'
import Link from 'app/Elements/Link'

export default () => (
  <div>
    <h1>Vocabulary</h1>
    {/* {status && status.total > 0 ? <div>
      Ready to study for {MINUTES} minutes?
      <br/>
      <Link to="/vocabulary/running">
        {status.counter && status.counter > 1 ? 'Continue' : 'Start'}
      </Link>
    </div> : `Loading...`} */}

    <Overview/>
  </div>
)


class Overview2 extends Component {
  render() {
    const { deck } = this.props.vocabulary
    if (!deck) return null;
    return <div>
      {Object.keys(deck.schedule).length} seen out of total {Object.keys(deck.cards).length} cards
    </div>
  }
}
const Overview = connect(state => ({
  vocabulary: state.vocabulary,
}))(Overview2)
