import GameContainer from "app/Vocabulary/Elements/GameContainer";
import React, { Component } from "react";
import { connect } from "react-redux";
import store from "app/App/store";
import { MINUTES } from "app/Vocabulary/actions/session";
import Link from "app/Router/Link";
import { updateURL } from "app/Router/actions";

const r = (props) => (
  <div id="vocabulary-screen">
    <div id="vocabulary-header">
      <button
        className="link"
        onClick={() => {
          props.vocabulary.deck.sessionDone();
        }}
      >
        Quit
      </button>
      <div>&nbsp;&nbsp;•&nbsp;&nbsp;</div>
      <Link href="/vocabulary/tutorial">Tutorial</Link>
      <div className="spacer" />
      {props.vocabulary.session &&
        props.vocabulary.session.cards.some((j) => j.sound) && (
          <button
            className="link"
            onClick={() => {
              store.dispatch({ type: "VOCABULARY_AUDIO_ONOFF" });
            }}
          >
            Audio: <b>{props.vocabulary.volume ? "On" : "Off"}</b>
          </button>
        )}
    </div>
    <GameContainer />
  </div>
);
export default connect((state) => ({
  vocabulary: state.vocabulary,
}))(r);
