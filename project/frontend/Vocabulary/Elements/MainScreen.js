import GameContainer from 'Vocabulary/Elements/GameContainer'
import React, { Component } from 'react';
import load from 'Vocabulary/actions/load'
import { connect } from 'react-redux';
import store from 'App/store'
export const SCREEN_VOCABULARY = 1

@connect(state => ({
  vocabulary: state.vocabulary,
}))
class MainScreen extends Component {
  componentDidMount() {
    load()
  }
  render() {
    const { screen } = this.props.vocabulary
    let Element;
    switch (screen) {
      case SCREEN_VOCABULARY:
        return <GameContainer/>
      default:
        return <div>
          To study today: 15 new words, review 40
          <br/>
          <button onClick={()=>{
            store.dispatch({
              type: 'VOCABULARY_SCREEN',
              content: SCREEN_VOCABULARY,
            })
          }}>Start</button>
        </div>
    }
  }
}
export default MainScreen
