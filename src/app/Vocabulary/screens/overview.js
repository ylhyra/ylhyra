import GameContainer from "app/Vocabulary/Elements/GameContainer";
import React, { Component } from "react";
import { connect } from "react-redux";
import store from "app/App/store";
import { MINUTES } from "app/Vocabulary/actions/session";
import {
  MakeSummaryOfCardStatuses,
  PercentageKnown,
  getCardIdsFromWords,
} from "app/Vocabulary/actions/_functions";
import Link from "app/Router/Link";

class Overview extends Component {
  render() {
    const { status, session } = this.props.vocabulary;
    return (
      <div>
        <h1>Vocabulary</h1>
        <Link href="VOCABULARY_PLAY">{session ? "Continue" : "Start"}</Link>
        <Overview2 />
      </div>
    );
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
}))(Overview);

class Overview3 extends Component {
  render() {
    const { deck } = this.props.vocabulary;
    if (!deck) return null;
    return <div>{PercentageKnown(Object.keys(deck.cards))}% known</div>;
  }
}
const Overview2 = connect((state) => ({
  vocabulary: state.vocabulary,
}))(Overview3);
