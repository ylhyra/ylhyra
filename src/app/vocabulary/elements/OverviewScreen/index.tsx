import Link from "app/router/Link";
import { countTerms, studyNewTerms } from "app/vocabulary/actions/functions";
import { PercentageKnownOverall } from "app/vocabulary/actions/functions/percentageKnown";
import Spacer from "documents/templates/Spacer";
import React, { Component } from "react";
import { connect } from "react-redux";
import { updateURL } from "app/router/actions/updateURL";
import ActivityOverview from "app/vocabulary/elements/OverviewScreen/ActivityCalendar";
import { calculateOverview } from "app/vocabulary/elements/OverviewScreen/actions";
import Section from "documents/templates/Section";
import { getUserLevel, printUserLevel } from "app/vocabulary/actions/userLevel";

class Overview extends Component<{ vocabulary: any }> {
  componentDidMount() {
    this.componentDidUpdate();
  }
  componentDidUpdate() {
    if (!this.props.vocabulary.overview.loaded) {
      calculateOverview();
    }
  }
  render() {
    const { deck, session, overview } = this.props.vocabulary;
    const p = overview.percentage_known_overall || null;
    return [
      <Section className="brown-background vocabulary-main-screen" key={1}>
        <Spacer space="70" />
        <div className="centered-button">
          <button
            onClick={() => updateURL("/vocabulary/play")}
            className="button dark-blue big"
          >
            {session ? "Continue" : "Start a study session"}
          </button>
          {deck && p !== null && (
            <div>
              {/*{p}% known out of {countTerms(deck.cards_sorted)} terms*/}
              {p}% known out of {deck.termCount} terms
            </div>
          )}
        </div>
        <Spacer space="70" />
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link href="/vocabulary/tutorial">Tutorial</Link>
          <div style={{ flex: "1" }} />
          {p !== null && p > 0.2 && (
            <button className="simple-button" onClick={() => studyNewTerms()}>
              Show me new terms
            </button>
          )}
        </div>
      </Section>,

      <Section key={2}>
        <ActivityOverview />
        <Spacer space="50" />
        {getUserLevel() && (
          <div>
            <button
              className="simple-button gray-button"
              onClick={() => updateURL("/vocabulary/difficulty")}
            >
              Change difficulty settings
              {/*({printUserLevel()})*/}
            </button>
          </div>
        )}
      </Section>,
    ];
  }
}
export default connect((state: any) => ({
  vocabulary: state.vocabulary,
}))(Overview);
