import Link from "app/Router/Link";
import {
  countTerms,
  studyNewTerms,
  studyParticularIds,
} from "app/Vocabulary/actions/functions";
import {
  PercentageKnown,
  PercentageKnownOverall,
} from "app/Vocabulary/actions/functions/percentageKnown";
import Spacer from "documents/Templates/Spacer";
import React, { Component } from "react";
import { connect } from "react-redux";

class Overview extends Component {
  render() {
    const { deck, session } = this.props.vocabulary;
    return (
      <div className="deck-loaded">
        <h1>Vocabulary</h1>
        <Link href="/vocabulary/tutorial">Tutorial</Link>
        <Spacer space="70" />
        <div className="centered-button">
          <Link href="VOCABULARY_PLAY" className="button dark-blue big">
            {session ? "Continue" : "Start a study session"}
          </Link>
          {deck && (
            <div>
              {PercentageKnownOverall()}% known out of{" "}
              {countTerms(deck.cards_sorted)} terms
            </div>
          )}
        </div>
        <Spacer space="70" />
        <hr />
        {deck && (
          <div>
            <b>Status by level</b>
            {[1, 2, 3].map((level) => {
              const cards = deck.cards_sorted.filter((c) => c.level === level);
              const ids = cards.map((c) => c.id);
              const level_name = ["A1", "A2", "B1"][level - 1];
              if (cards.length === 0) return null;
              return (
                <div key={level}>
                  {PercentageKnown(ids)}% known in level{" "}
                  <Link href={"/" + level_name}>{level_name}</Link> (out of{" "}
                  {countTerms(cards)} terms).{" "}
                  <button
                    className="small"
                    onClick={() => studyParticularIds(ids)}
                  >
                    Study
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <button className="small" onClick={() => studyNewTerms()}>
          Show me new terms
        </button>
      </div>
    );
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
}))(Overview);
