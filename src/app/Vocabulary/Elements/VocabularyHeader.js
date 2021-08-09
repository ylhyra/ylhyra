import React, { Component } from "react";
import { connect } from "react-redux";
import Link from "app/Router/Link";
import Button from "documents/Templates/Button";
import {
  MakeSummaryOfCardStatuses,
  studyParticularIds,
  getCardIdsFromTermIds,
} from "app/Vocabulary/actions/functions";
import { PercentageKnown } from "app/Vocabulary/actions/functions/percentageKnown";
import { DecodeDataInHTML } from "documents/Compile/functions/functions";
import { withDependencies } from "app/Vocabulary/actions/functions/withDependencies";
import _ from "underscore";

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
          className="big dark-blue"
          onClick={() => studyParticularIds(cards)}
        >
          Study {terms.length} terms
        </button>
        <div>
          <div>
            You know <b>{PercentageKnown(cards)}%</b> of this article’s words.
          </div>
          <div className="gray small">
            Additionally includes {dependencyTerms.length} prerequisite terms (
            {PercentageKnown(dependencyCards)}% known).
          </div>
        </div>
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
