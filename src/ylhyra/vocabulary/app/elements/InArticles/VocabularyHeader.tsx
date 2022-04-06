import React, { Component } from "react";
import { connect } from "react-redux";
import { studyParticularIds } from "ylhyra/vocabulary/app/actions/functions";
import { PercentageKnown } from "ylhyra/vocabulary/app/actions/functions/percentageKnown";
import { decodeDataInHtml } from "ylhyra/content/documents/compile/functions/functions";

class X extends Component<{ vocabulary: any; route: any; data: any }> {
  render() {
    const { cards } = this.props.data;
    if (cards.length === 0) return null;

    return (
      <div className="vocabulary-header">
        <button
          className="simple-button"
          onClick={() => studyParticularIds(cards)}
        >
          Study the words in this article
        </button>
        <span className="gray"> – </span>
        <span className="">
          <b>{PercentageKnown(cards)}%</b> known
        </span>
      </div>
    );
  }
}
const VocabularyHeader = connect((state: any) => ({
  vocabulary: state.vocabulary,
  route: state.route,
}))(X);

export default (props) => {
  return <VocabularyHeader data={decodeDataInHtml(props.data)} />;
};
