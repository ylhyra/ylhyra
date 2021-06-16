import React, { Component } from 'react';
import { connect } from 'react-redux'

class Progress extends Component {
  render() {
    const { bad, good, easy } = this.props.vocabulary.status
    const percentageDone = this.props.vocabulary.session.getAdjustedPercentageDone()
    const seen = bad + good + easy + Number.EPSILON
    const _bad = (bad / seen) * percentageDone
    const _good = (good / seen) * percentageDone
    const _easy = (easy / seen) * percentageDone
    // console.log({ bad, good, easy, percentageDone })
    return (
      <div className="vocabulary-progress">
        <div className="name">
          <span className="remaining"></span>
        </div>
        <div className="bar">
          <div className="part easy" style={{flex:_easy}}/>
          <div className="part good" style={{flex:_good}}/>
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
