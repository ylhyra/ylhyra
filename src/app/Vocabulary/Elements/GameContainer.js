import React, { Component } from 'react';
import Card from './Card'
import Progress from './Progress'
import { connect } from 'react-redux';
import { TextEventListenersOn, TextEventListenersOff } from 'documents/Read/Touch/'
import { isBrowser, hasLocalStorage, supportsTouch } from 'app/App/functions/isBrowser'

class GameContainer extends Component {
  // componentDidMount = () => {
  //   $('body').addClass('unscrollable')
  //   TextEventListenersOff()
  // }
  // componentWillUnmount = () => {
  //   $('body').removeClass('unscrollable')
  //   TextEventListenersOn()
  // }

  render() {
    const { status } = this.props.vocabulary
    return (
      <div id="game-container">
        <div className="vocabulary-card-outer-container">
          <Card/>
        </div>
        <Progress/>
      </div>
    )
  }
}
export default connect(state => ({
  vocabulary: state.vocabulary,
}))(GameContainer)
