import React from "react";
import { connect } from "react-redux";
import Link from "app/router/Link";
import { PercentageKnownOverall } from "app/vocabulary/actions/functions/percentageKnown";
import { isUserLoggedIn, existsSchedule } from "app/user/actions";
import demo, { turnOffDemonstration } from "./demo";

class Screen extends React.Component {
  componentDidMount() {
    demo();
  }
  componentWillUnmount() {
    turnOffDemonstration();
  }
  render() {
    return (
      <div className="frontpage-button">
        {!(isUserLoggedIn() || existsSchedule()) ? (
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
  }
}

export default connect((state) => ({
  vocabulary: state.vocabulary,
  user: state.user,
}))(Screen);