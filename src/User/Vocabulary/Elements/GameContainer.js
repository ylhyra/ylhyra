import React, { Component } from 'react';
import Card from './Card'
import Progress from './Progress'
import { connect } from 'react-redux';
import { TextEventListenersOn, TextEventListenersOff } from 'User/Render/Text/Touch/'
import { isBrowser, hasLocalStorage, supportsTouch } from 'User/App/functions/isBrowser'

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
      <div>
        <div className="vocabularynew-card-outer-container">
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
