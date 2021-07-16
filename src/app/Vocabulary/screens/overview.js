import GameContainer from "app/Vocabulary/Elements/GameContainer";
import React, { Component } from "react";
import { connect } from "react-redux";
import store from "app/App/store";
import { MINUTES } from "app/Vocabulary/actions/session";
import {
  studyParticularIds,
  countTerms,
} from "app/Vocabulary/actions/functions";
import {
  PercentageKnown,
  PercentageKnownOverall,
} from "app/Vocabulary/actions/functions/percentageKnown";

import { getCardIdsFromWords } from "app/Vocabulary/actions/functions/getCardIdsFromWords";
import Link from "app/Router/Link";
import _ from "underscore";

class Overview extends Component {
  render() {
    const { status, session } = this.props.vocabulary;
    return (
      <div>
        <h1>Vocabulary</h1>
        <div className="button">
          <Link href="VOCABULARY_PLAY">
            {session ? "Continue" : "Start a study session"}
          </Link>
        </div>
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
    return (
      <div>
        {PercentageKnownOverall()}% known out of {countTerms(deck.cards_sorted)}{" "}
        terms
        <br />
        <br />
        <br />
        <hr />
        <b>Status by level</b>
        {[1, 2, 3].map((level) => {
          const cards = deck.cards_sorted.filter((c) => c.level === level);
          const ids = cards.map((c) => c.id);
          const level_name = ["A1", "A2", "B1"][level - 1];
          return (
            <div key={level}>
              {PercentageKnown(ids)}% known in level {level_name} (out of{" "}
              {countTerms(cards)} terms).{" "}
              <button className="small" onClick={() => studyParticularIds(ids)}>
                Study
              </button>
            </div>
          );
        })}
      </div>
    );
  }
}
const Overview2 = connect((state) => ({
  vocabulary: state.vocabulary,
}))(Overview3);
