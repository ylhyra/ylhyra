import GameContainer from 'Vocabulary/Elements/GameContainer'
import React, { Component } from 'react';
import { InitializeDeck } from 'Vocabulary/actions/deck'
import { connect } from 'react-redux';
import store from 'App/store'
export const SCREEN_MAIN = 1
export const SCREEN_VOCABULARY = 2
export const SCREEN_DONE = 3

@connect(state => ({
  vocabulary: state.vocabulary,
}))
class MainScreen extends Component {
  componentDidMount() {
    InitializeDeck()
  }
  render() {
    const { screen, status } = this.props.vocabulary
    // let element;
    switch (screen) {
      case SCREEN_VOCABULARY:
        return <div id="vocabulary">
          <button onClick={()=>setScreen(SCREEN_MAIN)}>Exit</button>
          <GameContainer/>
        </div>
      case SCREEN_DONE:
        return <div id="vocabulary">
          <button onClick={()=>setScreen(SCREEN_MAIN)}>Exit</button>
          <div>Done for today!</div>
          <div>You studies X cards.</div>
          <div><button onClick={()=>store.getState().vocabulary.deck.continueStudying()}>Continue studying</button></div>
          {/* <div><button onClick={()=>store.getState().vocabulary.deck.studyNewWords()}>Study new words</button></div>
          <div><button onClick={()=>store.getState().vocabulary.deck.repeatTodaysWords()}>Study today’s difficult words again</button></div> */}
        </div>
      default:
        return <div id="vocabulary">
          <h1>Vocabulary</h1>
          {status && status.total > 0 ? <div>
            {status.wordsTotal} items to study
            <br/>
            <button onClick={()=>setScreen(SCREEN_VOCABULARY)}>Start</button>
          </div> : `Loading...`}
        </div>
    }
  }
}
export default MainScreen

export const setScreen = (scren) => {
  store.dispatch({
    type: 'VOCABULARY_SCREEN',
    content: scren,
  })
}
