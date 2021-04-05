import React, { Component } from 'react';
import { load } from './actions'
import Card from './Card'
import Progress from './Progress'
import { connect } from 'react-redux';

@connect(state => ({
  vocabulary: state.vocabulary,
}))
class GameContainer extends Component {
  componentDidMount() {
    load()
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



// @connect(state => ({
//   vocabulary: state.vocabulary,
// }))
// class TempStatus extends Component {
//   render() {
//     return (
//       <div>
//         <div className="vocabularynew-card-outer-container">
//           <Card/>
//         </div>
//         <Progress/>
//
//         <TempStatus/>
//       </div>
//     )
//   }
// }



const Table = () => {
  return <table>
    {/* <tbody>
      {test.map(({ is, en }) => (
        <tr><td><b>{is}</b></td><td>{en}</td></tr>
      ))}
    </tbody> */}
  </table>
}
