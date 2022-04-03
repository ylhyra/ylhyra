import React from "react";
import demo, { turnOffDemonstration } from "ylhyra/app/elements/frontpage/demo";
import Link from "ylhyra/app/router/Link";
import { existsSchedule, isUserLoggedIn } from "ylhyra/app/user/actions";
import { PercentageKnownOverall } from "ylhyra/app/vocabulary/actions/functions/percentageKnown";

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
              <Link href="/vocabulary/play" className="button dark-blue big">
                Start learning
              </Link>
            </div>
            <Link href="/login" className="below-button">
              Already have an account?
            </Link>
          </div>
        ) : (
          <div>
            <div>
              <Link href="/vocabulary/play" className="button dark-blue big">
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

export default Screen;