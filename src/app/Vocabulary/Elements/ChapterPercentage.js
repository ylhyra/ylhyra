import {
  MakeSummaryOfCardStatuses,
  studyParticularIds,
  getCardIdsFromTermIds,
} from "app/Vocabulary/actions/functions";
import { PercentageKnown } from "app/Vocabulary/actions/functions/percentageKnown";

import { connect } from "react-redux";
import React, { Component } from "react";
import ChapterWords from "app/Vocabulary/Elements/ChapterWords";
import ChapterPercentage from "app/Vocabulary/Elements/ChapterPercentage";
import {
  EncodeDataInHTML,
  DecodeDataInHTML,
} from "documents/Compile/functions/functions";

class X extends Component {
  render() {
    if (!this.props.vocabulary.deck) return null;
    if (this.props.data.missing) {
      console.log({ missing: this.props.data.missing });
    }
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
