import React, { Component } from "react";
import { connect } from "react-redux";
import Link from "app/Router/Link";
import Button from "documents/Templates/Button";
import {
  MakeSummaryOfCardStatuses,
  studyParticularIds,
} from "app/Vocabulary/actions/functions";
import { PercentageKnown } from "app/Vocabulary/actions/functions/percentageKnown";

import { withDependencies } from "app/Vocabulary/actions/functions/withDependencies";
import { getCardIdsFromWords } from "app/Vocabulary/actions/functions/getCardIdsFromWords";
import { getPlaintextFromVocabularyEntry } from "app/VocabularyMaker/functions";
import _ from "underscore";

class X extends Component {
  getCards = () => {
    const vocabulary_list = this.getList();
    if (!vocabulary_list) return null;
    return withDependencies(getCardIdsFromWords(vocabulary_list));
  };
  run = () => {
    studyParticularIds(this.getCards());
  };
  render() {
    const vocabulary_list = this.props.header_data?.vocabulary;
    const { deck } = this.props.vocabulary;
    if (!vocabulary_list || !deck) return null;
    const cards = getCardIdsFromWords(vocabulary_list);
    const dependencies = _.difference(
      withDependencies(getCardIdsFromWords(vocabulary_list)),
      cards
    );
    if (cards.length === 0) return null;
    if (this.props.button === false) {
      let tmp;
      if (true || process.env.NODE_ENV === "development") {
        tmp = (
          <div className="temporary-vocabulary-list" key={2}>
            {vocabulary_list
              .map(getPlaintextFromVocabularyEntry)
              // .map((j) => j.replace(/ /g, " "))
              .join(" • ")}
          </div>
        );
      }
      return [
        <small className="gray" key={1}>
          {PercentageKnown(cards, deck)}% known
        </small>,
        tmp,
      ];
    }
    return (
      <div>
        <div>{PercentageKnown(cards, deck)}% known</div>
        {/* <div>{JSON.stringify(MakeSummaryOfCardStatuses(cards, deck))}</div> */}
        <button
          className="big dark-blue"
          onClick={() => studyParticularIds(cards)}
        >
          Study {cards.length} cards
        </button>
        <div className="gray">
          Additionally includes {dependencies.length} prerequisite cards (
          {PercentageKnown(dependencies, deck)}% known).
        </div>
      </div>
    );
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
  route: state.route,
}))(X);
