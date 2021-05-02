import React, { Component } from 'react';
import Card from './Card'
import Progress from './Progress'
import { connect } from 'react-redux';
import { TextEventListenersOn, TextEventListenersOff } from 'Render/Text/Touch/'
import { isBrowser, hasLocalStorage, supportsTouch } from 'project/frontend/App/functions/isBrowser'

@connect(state => ({
  vocabulary: state.vocabulary,
}))
class GameContainer extends Component {
  componentDidMount = () => {
    $('body').addClass('unscrollable')
    TextEventListenersOff()
  }
  componentWillUnmount = () => {
    $('body').removeClass('unscrollable')
    TextEventListenersOn()
  }

  render() {
    const { status } = this.props.vocabulary
    return (
      <div>
        <div className="vocabularynew-card-outer-container">
          <Card/>
        </div>
        <Progress/>
      </div>
    )
  }
}
export default GameContainer
