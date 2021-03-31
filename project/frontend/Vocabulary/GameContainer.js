import test from './TestData'
import React, { Component } from 'react';

class GameContainer extends Component {
  render() {
    return (
      <div>
        <Card/>
        <Progress/>
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
