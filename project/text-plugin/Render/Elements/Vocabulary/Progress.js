import React, { Component } from 'react';
import { connect } from 'react-redux';

@connect((state, props) => {
  const { id } = props
  const { sections, progress, answers } = state.vocabulary
  const cards = sections[id] || []
  const answer = answers[id] || {}
  const total = cards.length
  const done = (progress[id] || 0) + (answer.answered ? 1 : 0)
  return {
    done: done,
    remaining: total - done,
  }
})
class Progress extends Component {
  render() {
    const { done, remaining } = this.props
    // console.log({ done, remaining } )
    return (
      <div className="progress">
        <div className="bar">
          <div className="part excellent" style={{flex:done}}/>
          <div className="part remaining" style={{flex:remaining}}/>
        </div>
        <div className="name">
          <span className="remaining"><b>{remaining}</b> cards remaining</span>
        </div>
      </div>
    )
  }
}
export default Progress
