import React, { Component } from 'react';
import { loadDeck } from 'Vocabulary/deck'
import Card from './Card'
import Progress from './Progress'
import { connect } from 'react-redux';

@connect(state => ({
  vocabulary: state.vocabulary,
}))
class GameContainer extends Component {
  componentDidMount() {
    // loadDeck()
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
