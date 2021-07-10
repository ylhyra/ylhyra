import React, { Component } from "react";
import { connect } from "react-redux";
import Link from "app/Router/Link";
import Button from "documents/Templates/Button";
import {
  MakeSummaryOfCardStatuses,
  PercentageKnown,
  getCardIdsFromWords,
  studyParticularIds,
  withDependencies,
} from "app/Vocabulary/actions/_functions";

class X extends Component {
  getCards = () => {
    const vocabulary_list = this.getList();
    if (!vocabulary_list) return null;
    return withDependencies(getCardIdsFromWords(vocabulary_list));
  };
  run = () => {
    studyParticularIds(this.getCards());
  };
  getList = () => {
    return (
      (this.props.header_data && this.props.header_data.vocabulary) ||
      (this.props.route.data && this.props.route.data.header.vocabulary)
    );
  };
  render() {
    if (this.props.route.pathname === "/") return null;
    const vocabulary_list = this.getList();
    const { deck } = this.props.vocabulary;
    if (!vocabulary_list || !deck) return null;
    const cards = this.getCards();
    if (cards.length === 0) return null;
    if (this.props.button === false) {
      return (
        <small className="gray">{PercentageKnown(cards, deck)}% known</small>
      );
    }
    return (
      <div>
        <div>{PercentageKnown(cards, deck)}% known</div>
        {/* <div>{JSON.stringify(MakeSummaryOfCardStatuses(cards, deck))}</div> */}
        <button onClick={this.run}>Study {cards.length} cards</button>
      </div>
    );
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
  route: state.route,
}))(X);
