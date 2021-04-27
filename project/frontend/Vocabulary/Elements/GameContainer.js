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
    // load()
    $('body').addClass('unscrollable')
    // $('#speed-reader').on('click', startStop)
    // document.addEventListener('keydown', checkKey);
    // !supportsTouch && document.addEventListener('mousemove', mouseListener);
    TextEventListenersOff()
  }
  componentWillUnmount = () => {
    $('body').removeClass('unscrollable')
    // document.removeEventListener('keydown', checkKey);
    // !supportsTouch && document.removeEventListener('mousemove', mouseListener);
    TextEventListenersOn()
  }

  render() {
    const { status } = this.props.vocabulary
    return (
      <div>
        <div className="vocabularynew-card-outer-container">
          {status.deckDone ? 'Done :)' : <Card/>}
        </div>
        <Progress/>

        {/* <TempStatus/> */}
      </div>
    )
  }
}
export default GameContainer


const Table = () => {
  return <table>
    {/* <tbody>
      {test.map(({ is, en }) => (
        <tr><td><b>{is}</b></td><td>{en}</td></tr>
      ))}
    </tbody> */}
  </table>
}
