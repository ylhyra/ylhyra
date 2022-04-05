import React, { Component } from "react";
import { connect } from "react-redux";
import { RootState } from "ylhyra/app/app/store";
import { getCardIdsFromTermIds } from "ylhyra/vocabulary/app/actions/card/functions";
import { PercentageKnown } from "ylhyra/vocabulary/app/actions/functions/percentageKnown";

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
const connector = connect((state: RootState) => ({
  vocabulary: state.vocabulary,
  route: state.route,
}));
export default connector(X);
