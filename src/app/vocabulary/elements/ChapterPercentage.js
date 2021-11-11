import { PercentageKnown } from "app/vocabulary/actions/functions/percentageKnown";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getCardIdsFromTermIds } from "app/vocabulary/actions/card/functions";

class X extends Component {
  render() {
    if (!this.props.vocabulary.deck) return null;
    // logMissing(this.props.data.missing);
    return (
      <small className="percentage-known sans-serif" key={1}>
        {PercentageKnown(getCardIdsFromTermIds(this.props.data.terms))}% known
      </small>
    );
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
  route: state.route,
}))(X);
