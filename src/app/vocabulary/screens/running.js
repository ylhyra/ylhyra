import store from "app/app/store";
import { updateURL } from "app/router/actions/updateURL";
import GameContainer from "app/vocabulary/elements/GameContainer";
import React, { Component } from "react";
import { connect } from "react-redux";

class R extends Component {
  componentDidMount() {
    window.addEventListener("keydown", this.checkKey);
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.checkKey);
  }
  checkKey = (e) => {
    this.props.vocabulary.deck?.session?.checkForUndoOnKeyDown(e);
  };
  render() {
    const session = this.props.vocabulary.deck?.session;
    if (!session) return null;
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
                updateURL("/vocabulary/tutorial", { dontChangeUrl: true });
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
            {session?.cards.some((j) => j.sound) && (
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
          <GameContainer />
        </div>
      </div>
    );
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
}))(R);
