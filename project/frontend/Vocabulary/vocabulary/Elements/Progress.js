import React, { Component } from 'react';
import { connect } from 'react-redux'

@connect(state => ({
  vocabulary: state.vocabulary,
}))
class Progress extends Component {
  render() {
    const { good, ok, bad, total, cardsDone, wordsTotal, wordsDone } = this.props.vocabulary.status
    if (!total) return null;
    const { totalTime, remainingTime } = this.props.vocabulary.session
    const doneTime = totalTime - remainingTime
    const _bad = (bad / total) * doneTime
    const _ok = (ok / total) * doneTime
    const _good = (good / total) * doneTime
    // console.log({bad,_bad,_ok, remainingTime})
    return (
      <div className="vocabularynew-progress">
        <div className="name">
          <span className="remaining"></span>
        </div>
        <div className="bar">
          <div className="part excellent" style={{flex:Math.round(_good/100)}}/>
          <div className="part good" style={{flex:Math.round(_ok/100)}}/>
          <div className="part bad" style={{flex:Math.round(_bad/100)}}/>
          <div className="part remaining" style={{flex:Math.round(remainingTime/100)}}/>
        </div>
      </div>
    )
  }
}
export default Progress
