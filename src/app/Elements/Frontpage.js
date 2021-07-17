import React from "react";
import { connect } from "react-redux";
import Link from "app/Router/Link";
import { PercentageKnownOverall } from "app/Vocabulary/actions/functions/percentageKnown";

const Screen = (props) => (
  <div className="frontpage-splashscreen">
    {!props.user &&
    (!props.vocabulary.deck ||
      Object.keys(props.vocabulary.deck.schedule).length < 2) ? (
      <div>
        <div>
          <Link href="VOCABULARY_PLAY" className="button dark-blue big">
            Start learning
          </Link>
        </div>
        <Link href="LOG_IN" className="below-button">
          Already have an account?
        </Link>
      </div>
    ) : (
      <div>
        <div>
          <Link href="VOCABULARY_PLAY" className="button dark-blue big">
            Start session
          </Link>
          <div className="below-button">
            {PercentageKnownOverall()}% known overall
          </div>
        </div>
      </div>
    )}
  </div>
);

export default connect((state) => ({
  vocabulary: state.vocabulary,
  user: state.user,
}))(Screen);
