import { studyParticularIds } from "app/vocabulary/actions/functions";
import { PercentageKnown } from "app/vocabulary/actions/functions/percentageKnown";
import { DecodeDataInHTML } from "documents/compile/functions/functions";
import React, { Component } from "react";
import { connect } from "react-redux";

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
  return <VocabularyHeader data={DecodeDataInHTML(props.data)} />;
};
