import GameContainer from 'Vocabulary/Elements/GameContainer'
import React, { Component } from 'react';
import load from 'Vocabulary/actions/load'
import { connect } from 'react-redux';
import store from 'App/store'
export const SCREEN_MAIN = 1
export const SCREEN_VOCABULARY = 2

@connect(state => ({
  vocabulary: state.vocabulary,
}))
class MainScreen extends Component {
  componentDidMount() {
    load()
  }
  render() {
    const { screen, status } = this.props.vocabulary
    let Element;
    switch (screen) {
      case SCREEN_VOCABULARY:
        return <div id="vocabulary">
          <button onClick={()=>{
            store.dispatch({
              type: 'VOCABULARY_SCREEN',
              content: SCREEN_MAIN,
            })
          }}>Back</button>
          <GameContainer/>
        </div>
      default:
        return <div id="vocabulary">
          {status && status.total > 0 ? <div>
            {status.wordsTotal} items to study
            <br/>
            <button onClick={()=>{
              store.dispatch({
                type: 'VOCABULARY_SCREEN',
                content: SCREEN_VOCABULARY,
              })
            }}>Start</button>
          </div> : `Loading...`}
        </div>
    }
  }
}
export default MainScreen
