import GameContainer from 'Vocabulary/Elements/GameContainer'
import React, { Component } from 'react';
import { loadDeck } from 'Vocabulary/deck'
import { connect } from 'react-redux';

@connect(state => ({
  vocabulary: state.vocabulary,
}))
class MainScreen extends Component {
  componentDidMount() {
    // loadDeck()
  }
  render() {
    const { status } = this.props.vocabulary
    let Element;
    switch (status) {
      case 'GAME':
        return <GameContainer/>
      default:
        return <div>
          To study today: 15 new words, review 40
          <br/>
          <button onClick={()=>{}}>Start</button>
        </div>
    }
  }
}
export default MainScreen
