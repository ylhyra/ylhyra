import React, { Component } from 'react';
import { load } from './actions'
import Card from './Card'
import Progress from './Progress'

class GameContainer extends Component {
  componentDidMount() {
    load()
  }
  render() {
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



const Table = () => {
  return <table>
    {/* <tbody>
      {test.map(({ is, en }) => (
        <tr><td><b>{is}</b></td><td>{en}</td></tr>
      ))}
    </tbody> */}
  </table>
}
