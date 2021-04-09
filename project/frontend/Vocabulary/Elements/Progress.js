import React, { Component } from 'react';
import { connect } from 'react-redux'

@connect(state => ({
  vocabulary: state.vocabulary,
}))
class Progress extends Component {
  render() {
    const { good, ok, bad, total, cardsDone, wordsTotal, wordsDone } = this.props.vocabulary.status
    // console.log({ good, ok, bad, total })
    if (!total) return null;
    const newCardsRemaining = total - good - ok - bad
    const needToStudy = total - cardsDone
    const wordsToStudy = wordsTotal - wordsDone

    const secondsLeft = needToStudy * 10 * 5
    return (
      <div className="vocabularynew-progress">
        <div className="name">
          {/* <span className="remaining">Approximately {Math.floor(secondsLeft/60)}:{(Math.floor(secondsLeft%60) < 10 ? '0':'') + Math.floor(secondsLeft%60).toString()} left</span> */}
          <span className="remaining">
            {/* <b>{newCardsRemaining}</b> new card{needToStudy===1?'':'s'} left, <b>{wordsToStudy}</b> word{wordsToStudy===1?'':'s'} left to memorize */}
          </span>
        </div>
        <div className="bar">
          <div className="part bad" style={{flex:bad}}/>
          <div className="part good" style={{flex:ok}}/>
          <div className="part excellent" style={{flex:good}}/>
          <div className="part remaining" style={{flex:needToStudy}}/>
        </div>
      </div>
    )
  }
}
export default Progress
