import GameContainer from "app/Vocabulary/Elements/GameContainer";
import React, { Component } from "react";
import { connect } from "react-redux";
import store from "app/App/store";
import { MINUTES } from "app/Vocabulary/actions/session";
import Link from "app/Router/Link";
import { updateURL } from "app/Router/actions";

class R extends Component {
  componentDidMount() {
    window.addEventListener("keydown", this.checkKey);
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.checkKey);
  }
  checkKey = (e) => {
    this.props.vocabulary?.session?.keyDown(e);
  };
  render() {
    return (
      <div id="vocabulary-screen">
        <div id="vocabulary-screen-inner">
          <div id="vocabulary-header">
            <button
              className="link"
              onClick={() => {
                this.props.vocabulary.session.sessionDone();
              }}
            >
              Quit
            </button>
            <div>&nbsp;&nbsp;•&nbsp;&nbsp;</div>
            <Link href="/vocabulary/tutorial">Tutorial</Link>
            {this.props.vocabulary.session?.undoable() && [
              <div key={1}>&nbsp;&nbsp;•&nbsp;&nbsp;</div>,
              <button
                key={2}
                className="link"
                onClick={() => {
                  this.props.vocabulary.session.undo();
                }}
              >
                Undo
              </button>,
            ]}
            <div className="spacer" />
            {this.props.vocabulary.session?.cards.some((j) => j.sound) && (
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
