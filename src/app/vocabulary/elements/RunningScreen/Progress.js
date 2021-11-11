import React, { Component } from "react";
import { connect } from "react-redux";

class Progress extends Component {
  render() {
    const percentageDone =
      this.props.vocabulary.deck?.session?.getPercentageDone();
    return (
      <div className="vocabulary-progress">
        <div className="bar">
          <div className="part done" style={{ flex: percentageDone }} />
          <div
            className="part remaining"
            style={{ flex: 100 - percentageDone }}
          />
        </div>
      </div>
    );
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
}))(Progress);
