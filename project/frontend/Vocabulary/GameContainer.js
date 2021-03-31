import test from './TestData'
import React, { Component } from 'react';

class GameContainer extends Component {
  render() {
    const { correctCount, incorrectCount, total, currentIndex } = this.props
    const remaining = total - (correctCount + incorrectCount)
    const position = total - currentIndex
    return (
      <div className="progress">
        <div className="bar">
          <div className="part good" style={{flex:correctCount}}/>
          <div className="part bad" style={{flex:incorrectCount}}/>
          <div className="part remaining" style={{flex:remaining}}/>
        </div>
        <div className="name">
          <span className="remaining"><b>{position}</b> cards remaining</span>
        </div>
      </div>
    )
  }
}
export default GameContainer



const Table = () => {
  return <table>
    <tbody>
      {test.map(({ is, en }) => (
        <tr><td><b>{is}</b></td><td>{en}</td></tr>
      ))}
    </tbody>
  </table>
}
