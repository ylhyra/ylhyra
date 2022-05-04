import { prettyPrintDaysMinutesHours, seconds } from "modules/time";
import React, { Component } from "react";
import { connect } from "react-redux";
import ReactActivityCalendar from "ylhyra/app/app/functions/react-activity-calendar";
import { withPlural } from "modules/simplePlural";
import Spacer from "ylhyra/documents/renderDocument/templates/Spacer";

class ActivityCalendar extends Component<{ vocabulary: any }> {
  render() {
    const { deck, overview } = this.props.vocabulary;
    if (!deck) return null;

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

            <ReactActivityCalendar
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
export default connect((state: any) => ({
  vocabulary: state.vocabulary,
}))(ActivityCalendar);
