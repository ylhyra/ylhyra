import { log } from "modules/log";
import React, { Component } from "react";
import { connect } from "react-redux";
import store from "ylhyra/app/app/store";
import { goToUrl } from "ylhyra/app/router/actions/goToUrl";
import { getSound } from "ylhyra/app/vocabulary/actions/card/card_data";
import Session from "ylhyra/app/vocabulary/actions/session";
import { getUserLevel } from "ylhyra/app/vocabulary/actions/userLevel";
import Card from "ylhyra/app/vocabulary/elements/RunningScreen/CardElement";
import Progress from "ylhyra/app/vocabulary/elements/RunningScreen/Progress";
import SelectLevelScreen from "ylhyra/app/vocabulary/elements/UserLevelScreen";

class RunningScreen extends Component<{ vocabulary: any }> {
  componentDidMount = () => {
    this.componentDidUpdate();
    window.addEventListener("keydown", this.checkKey);
  };
  componentDidUpdate = () => {
    const { deck } = this.props.vocabulary;
    if (!deck!.session.currentCard) {
      log(
        "No current cardInSession when GameContainer was loaded, initializing"
      );
      deck!.session.initializeSession(); //tmp!
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
    const session: Session = this.props.vocabulary.deck?.session;
    if (!session) return null;
    const { card } = this.props.vocabulary;
    if (!card) return null;
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
                goToUrl("/vocabulary/tutorial", {
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
            {session?.cards.some((j) => getSound(j.getId())) && (
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
export default connect((state: any) => ({
  vocabulary: state.vocabulary,
}))(RunningScreen);
