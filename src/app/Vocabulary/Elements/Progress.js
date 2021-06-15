import React, { Component } from 'react';
import { connect } from 'react-redux'

class Progress extends Component {
  render() {
    const { good, ok, bad, total, cardsDone, wordsTotal, wordsDone } = this.props.vocabulary.status
    if (!total) return null;
    const percentageDone = this.props.vocabulary.session.getAdjustedPercentageDone()
    const _bad = (bad / total) * percentageDone
    const _ok = (ok / total) * percentageDone
    const _good = (good / total) * percentageDone
    return (
      <div className="vocabulary-progress">
        <div className="name">
          <span className="remaining"></span>
        </div>
        <div className="bar">
          <div className="part excellent" style={{flex:_good}}/>
          <div className="part good" style={{flex:_ok}}/>
          <div className="part bad" style={{flex:_bad}}/>
          <div className="part remaining" style={{flex:100-percentageDone}}/>
        </div>
      </div>
    )
  }
}
export default connect(state => ({
  vocabulary: state.vocabulary,
}))(Progress)
