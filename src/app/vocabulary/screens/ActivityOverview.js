import React, { Component } from "react";
import Link from "app/router/Link";
import Spacer from "documents/templates/Spacer";
import { updateURL } from "app/router/actions/updateURL";
import { PercentageKnownOverall } from "app/vocabulary/actions/functions/percentageKnown";
import { countTerms, studyNewTerms } from "app/vocabulary/actions/functions";
import { connect } from "react-redux";

import ActivityCalendar from "react-activity-calendar";
import { isDev } from "app/app/functions/isDev";

class ActivityOverview extends Component {
  render() {
    if (!isDev) return null;
    const { deck, session } = this.props.vocabulary;
    return <ActivityCalendar
      data={[
        {
          count: 2,
          date: '2021-01-01',
          level: 0
        },
        {
          count: 4,
          date: '2021-01-02',
          level: 2
        },
      ]}
      hideColorLegend
      hideTotalCount
      labels={{
        months: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ],
        totalCount: '{{count}} contributions in {{year}}',
        weekdays: [
          'Sun',
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Fri',
          'Sat'
        ]
      }}
    />;
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
}))(ActivityOverview);
