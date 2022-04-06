import React, { Component } from "react";
import { connect } from "react-redux";
import { goToUrl } from "ylhyra/app/router/actions/goToUrl";
import Link from "ylhyra/app/router/Link";
import { studyNewTerms } from "ylhyra/vocabulary/app/actions/functions";
import { getUserLevel } from "ylhyra/vocabulary/app/actions/userLevel";
import { calculateOverview } from "ylhyra/vocabulary/app/elements/OverviewScreen/actions";
import ActivityOverview from "ylhyra/vocabulary/app/elements/OverviewScreen/ActivityCalendar";
import Section from "ylhyra/content/documents/templates/Section";
import Spacer from "ylhyra/content/documents/templates/Spacer";

class Overview extends Component<{ vocabulary: any }> {
  componentDidMount() {
    this.componentDidUpdate();
  }
  componentDidUpdate() {
    if (!this.props.vocabulary.overview.loaded) {
      void calculateOverview();
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
            onClick={() => goToUrl("/vocabulary/play")}
            className="button dark-blue big"
          >
            {session ? "Continue" : "Start a study session"}
          </button>
          {deck && p !== null && (
            <div>
              {/*{p}% known out of {countTerms(deck!.cards_sorted)} terms*/}
              {p}% known out of {deck!.termCount} terms
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
              onClick={() => goToUrl("/vocabulary/difficulty")}
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
