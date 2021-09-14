import React, { Component } from "react";
import { connect } from "react-redux";
import { studyParticularIds } from "app/vocabulary/actions/functions";
import { PercentageKnown } from "app/vocabulary/actions/functions/percentageKnown";
import { DecodeDataInHTML } from "documents/compile/functions/functions";

class X extends Component {
  getCards = () => {
    // const vocabulary_list = this.getList();
    // if (!vocabulary_list) return null;
    // return withDependencies(getCardIdsFromWords(vocabulary_list));
  };
  run = () => {
    // studyParticularIds(this.getCards());
  };
  render() {
    const { terms, dependencyTerms, cards, dependencyCards } = this.props.data;
    // const cards = getCardIdsFromTermIds(terms);
    // const dependencyCards = getCardIdsFromTermIds(dependencyTerms);
    if (cards.length === 0) return null;

    return (
      <div className="vocabulary-header">
        <button
          className="simple-button"
          onClick={() => studyParticularIds(cards)}
        >
          Study this article’s words
        </button>
        <b>{PercentageKnown(cards)}%</b> known
        {/*<div>*/}
        {/*  <div>*/}
        {/*    You know <b>{PercentageKnown(cards)}%</b> of this article’s words.*/}
        {/*  </div>*/}
        {/*  <div className="gray small">*/}
        {/*    Additionally includes {dependencyTerms.length} prerequisite terms (*/}
        {/*    {PercentageKnown(dependencyCards)}% known).*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    );
  }
}
const VocabularyHeader = connect((state) => ({
  vocabulary: state.vocabulary,
  route: state.route,
}))(X);

export default (props) => {
  // if (!isBrowser) return <div />;
  return <VocabularyHeader data={DecodeDataInHTML(props.data)} />;
};
