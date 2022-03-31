import { getCardIdsFromTermIds } from "ylhyra/app/vocabulary/actions/card/functions";
import { PercentageKnown } from "ylhyra/app/vocabulary/actions/functions/percentageKnown";
import React, { Component } from "react";
import { connect } from "react-redux";
import { RootState } from "ylhyra/app/app/store";

class X extends Component<{ vocabulary: any; data: any }> {
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
export default connect((state: RootState) => ({
  vocabulary: state.vocabulary,
  route: state.route,
}))(X);
