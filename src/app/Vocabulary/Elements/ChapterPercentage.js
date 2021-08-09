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
import _ from "underscore";

class X extends Component {
  render() {
    if (!this.props.vocabulary.deck) return null;
    logMissing(this.props.data.missing);
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

let timer;
let missing = [];
const logMissing = (input) => {
  if (!input) return;
  if (!process.env.NODE_ENV !== "development") return;
  if (input.length > 0) {
    timer && clearTimeout(timer);
    missing = missing.concat(input);
    timer = setTimeout(() => {
      missing = _.uniq(missing);
      console.log(
        `${missing.length} missing terms:\n${_.uniq(missing).join("\n")}`
      );
      // console.log(missing.join("\n"));
    }, 1000);
  }
};
