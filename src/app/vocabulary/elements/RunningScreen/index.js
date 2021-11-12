import store from "app/app/store";
import { updateURL } from "app/router/actions/updateURL";
import React, { Component } from "react";
import { connect } from "react-redux";
import Card from "app/vocabulary/elements/RunningScreen/CardElement";
import Progress from "app/vocabulary/elements/RunningScreen/Progress";
import { log } from "app/app/functions/log";
import SelectLevelScreen from "app/vocabulary/elements/UserLevelScreen";
import { getUserLevel } from "app/vocabulary/actions/userLevel";

class RunningScreen extends Component {
  componentDidMount = () => {
    this.componentDidUpdate();
    window.addEventListener("keydown", this.checkKey);
  };
  componentDidUpdate = () => {
    const { deck } = this.props.vocabulary;
    if (!deck.session.currentCard) {
      log(
        "No current cardInSession when GameContainer was loaded, initializing"
      );
      deck.session.InitializeSession(); //tmp!
    }
  };
  componentWillUnmount() {
    window.removeEventListener("keydown", this.checkKey);
  }
  checkKey = (e) => {
    this.props.vocabulary.deck?.session?.checkForUndoOnKeyDown(e);
  };
  render() {
    if (!getUserLevel()) {
      return <SelectLevelScreen />;
    }
    const session = this.props.vocabulary.deck?.session;
    if (!session) return null;
    const { card } = this.props.vocabulary;
    return (
      <div id="vocabulary-screen">
        <div id="vocabulary-screen-inner">
          <div id="vocabulary-header">
            <button className="link" onClick={() => session?.sessionDone()}>
              Quit
            </button>
            <div>&nbsp;&nbsp;•&nbsp;&nbsp;</div>
            <button
              className="link"
              onClick={() => {
                updateURL("/vocabulary/tutorial", {
                  dontChangeUrl: true,
                });
              }}
            >
              Tutorial
            </button>
            {session.undoable() && [
              <div key={1}>&nbsp;&nbsp;•&nbsp;&nbsp;</div>,
              <button
                key={2}
                className="link"
                onClick={() => {
                  session.undo();
                }}
              >
                Undo
              </button>,
            ]}
            <div className="spacer" />
            {session?.cards.some((j) => j.getSound()) && (
              <button
                className="link"
                onClick={() => {
                  store.dispatch({ type: "VOCABULARY_AUDIO_ONOFF" });
                }}
              >
                Audio: <b>{this.props.vocabulary.volume ? "On" : "Off"}</b>
              </button>
            )}
          </div>

          <div id="game-container">
            <div className="vocabulary-card-outer-container">
              <Card key={card.counter} />
            </div>
            <Progress />
          </div>
        </div>
      </div>
    );
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
}))(RunningScreen);
