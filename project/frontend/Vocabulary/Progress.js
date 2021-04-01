import React, { Component } from 'react';
import { connect } from 'react-redux'

@connect(state => ({
  vocabulary: state.vocabulary,
}))
class Progress extends Component {
  render() {
    const { good, ok, bad, total } = this.props.vocabulary.status
    const remaining = total - good - ok - bad
    return (
      <div className="vocabularynew-progress">
        <div className="name">
          <span className="remaining"><b>{remaining}</b> {remaining===1?'card':'cards'} remaining</span>
        </div>
        <div className="bar">
          <div className="part good" style={{flex:good}}/>
          <div className="part mediocre" style={{flex:ok}}/>
          <div className="part bad" style={{flex:bad}}/>
          <div className="part remaining" style={{flex:remaining}}/>
        </div>
      </div>
    )
  }
}
export default Progress
