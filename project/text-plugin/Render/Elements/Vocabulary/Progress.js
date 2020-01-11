import React, { Component } from 'react';

class Progress extends Component {
  render() {
    const { correctCount, incorrectCount, total } = this.props
    const remaining = total - (correctCount + incorrectCount)
    return (
      <div className="progress">
        <div className="bar">
          <div className="part good" style={{flex:correctCount}}/>
          <div className="part bad" style={{flex:incorrectCount}}/>
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
