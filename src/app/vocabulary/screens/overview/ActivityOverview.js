import React, { Component } from "react";
import { connect } from "react-redux";
import ActivityCalendar from "react-activity-calendar";
import { isDev } from "app/app/functions/isDev";
import { getSessions } from "app/vocabulary/actions/sync";
import {
  day,
  days,
  prettyPrintDaysMinutesHours,
  seconds,
} from "app/app/functions/time";
import { EACH_SESSION_LASTS_X_MINUTES } from "app/app/constants";
import { clamp } from "app/app/functions/math";
import _ from "underscore";

class ActivityOverview extends Component {
  render() {
    if (!isDev) return null;
    const { deck } = this.props.vocabulary;
    if (!deck) return null;

    return (
      <div>
        Streak: {streak} day{streak === 1 ? "" : "s"}
        <br />
        Total time spent:{" "}
        {prettyPrintDaysMinutesHours(total_seconds_spent * seconds)}
        <br />
        Activity:
        <ActivityCalendar
          data={data}
          hideColorLegend
          hideTotalCount
          showWeekdayLabels
          labels={{
            months: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          }}
        />
      </div>
    );
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
}))(ActivityOverview);
