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

// let timer;
// let missing = [];
// const logMissing = (input) => {
//   if (!input) return;
//   if (!isDev) return;
//   if (input.length > 0) {
//     timer && clearTimeout(timer);
//     missing = missing.concat(input);
//     timer = setTimeout(() => {
//       missing = _.uniq(missing);
//       log(`${missing.length} missing terms:\n${_.uniq(missing).join("\n")}`);
//       // log(missing.join("\n"));
//     }, 1000);
//   }
// };
