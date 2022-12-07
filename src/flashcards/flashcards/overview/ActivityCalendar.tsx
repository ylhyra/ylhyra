import { prettyPrintDaysMinutesHours, seconds } from "modules/time";
import React from "react";
import ReactActivityCalendar from "modules/react-activity-calendar";
import { withPlural } from "modules/simplePlural";
import { observer } from "mobx-react";
import { ActivityCalendarOverview } from "flashcards/flashcards/overview/actions";

export const ActivityCalendar = observer(() => {
  const overview = new ActivityCalendarOverview();
  return (
    <div className="vocabulary-overview-section">
      <div>
        <b>Activity streak:</b> {withPlural(overview.streak, "day")} in a row
      </div>
      {overview.secondsSpentThisWeek !== overview.secondsSpentTotal && (
        <div>
          <b>Time played this week:</b>{" "}
          {prettyPrintDaysMinutesHours(
            (overview.secondsSpentThisWeek || 0) * seconds,
          )}
        </div>
      )}
      <div>
        <b>Total time played:</b>{" "}
        {prettyPrintDaysMinutesHours(
          (overview.secondsSpentTotal || 0) * seconds,
        )}
      </div>

      {overview.calendarData && (
        <div>
          <b>Activity overview:</b>

          <ReactActivityCalendar
            data={overview.calendarData}
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
});
