import React, { Component } from "react";
import { connect } from "react-redux";
import ActivityCalendar from "./react-activity-calendar/index.ts";
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
import { withPlural } from "app/app/functions/simplePlural";

class ActivityOverview extends Component {
  render() {
    if (!isDev) return null;
    const { deck, overview } = this.props.vocabulary;
    if (!deck || !overview) return null;

    return (
      <div className="vocabulary-overview-section">
        Streak: {withPlural(overview.streak, "day")}
        <br />
        Total time spent:{" "}
        {prettyPrintDaysMinutesHours(overview.seconds_spent_total * seconds)}
        <br />
        Activity:
        <ActivityCalendar
          data={overview.calendar_data}
          hideColorLegend
          hideTotalCount
          showWeekdayLabels
          fontSize={12}
          theme={{
            level0: "#F0F0F0",
            level1: "#C4EDDE",
            level2: "#7AC7C4",
            level3: "#F73859",
            level4: "#384259",
            level5: "orange",
          }}
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
