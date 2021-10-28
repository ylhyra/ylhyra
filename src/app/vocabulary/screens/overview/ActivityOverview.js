import React, { Component } from "react";
import { connect } from "react-redux";
import ActivityCalendar from "./react-activity-calendar/index.ts";
import { isDev } from "app/app/functions/isDev";
import {
  day,
  prettyPrintDaysMinutesHours,
  seconds,
} from "app/app/functions/time";
import { withPlural } from "app/app/functions/simplePlural";
import Spacer from "documents/templates/Spacer";

class ActivityOverview extends Component {
  render() {
    if (!isDev) return null;
    const { deck, overview } = this.props.vocabulary;
    if (!deck) return null;

    // if (!overview.seconds_spent_total) return null;
    return (
      <div className="vocabulary-overview-section">
        <Spacer space="10" />

        <div>
          <b>Activity streak:</b> {withPlural(overview.streak, "day")} in a row
        </div>
        {overview.seconds_spent_this_week !== overview.seconds_spent_total && (
          <div>
            <b>Time played this week:</b>{" "}
            {prettyPrintDaysMinutesHours(
              (overview.seconds_spent_this_week || 0) * seconds
            )}
          </div>
        )}
        <div>
          <b>Total time played:</b>{" "}
          {prettyPrintDaysMinutesHours(
            (overview.seconds_spent_total || 0) * seconds
          )}
        </div>
        <Spacer space="10" />

        {overview.calendar_data && (
          <div>
            <b>Activity overview:</b>

            <ActivityCalendar
              data={overview.calendar_data}
              hideColorLegend
              hideTotalCount
              showWeekdayLabels
              fontSize={12}
              blockMargin={3}
            />
          </div>
        )}
      </div>
    );
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
}))(ActivityOverview);
