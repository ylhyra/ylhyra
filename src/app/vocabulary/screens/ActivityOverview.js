import React, { Component } from "react";
import { connect } from "react-redux";
import ActivityCalendar from "react-activity-calendar";
import { isDev } from "app/app/functions/isDev";
import { getSessions } from "app/vocabulary/actions/sync";
import { hours } from "app/app/functions/time";

/* The day starts at 04:00 */
const DAY_STARTS_AT = 4 * hours;

class ActivityOverview extends Component {
  render() {
    if (!isDev) return null;
    const { deck } = this.props.vocabulary;
    if (!deck) return null;

    const sessions = getSessions();
    console.log(sessions);
    sessions.forEach((session) => {});

    return (
      <ActivityCalendar
        data={[
          {
            count: 2,
            date: "2021-01-01",
            level: 0,
          },
          {
            count: 4,
            date: "2021-01-02",
            level: 2,
          },
        ]}
        hideColorLegend
        hideTotalCount
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
          totalCount: "{{count}} contributions in {{year}}",
          weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        }}
      />
    );
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
}))(ActivityOverview);
