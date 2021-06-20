import React from "react";
import { connect } from "react-redux";
import Link from "app/Router/Link";
import { PercentageKnownOverall } from "app/Vocabulary/actions/_functions";

const Screen = (props) => (
  <div>
    {!props.user ? (
      <div>
        <div>
          <Link href="VOCABULARY_PLAY" className="button">
            Start learning
          </Link>
        </div>
        <Link href="LOG_IN">Already have an account?</Link>
      </div>
    ) : (
      <div>
        <div>
          <Link href="VOCABULARY_PLAY" className="button">
            Play
          </Link>
          {PercentageKnownOverall()}% known
        </div>
      </div>
    )}
  </div>
);

export default connect((state) => ({
  user: state.user,
}))(Screen);
