import GameContainer from "app/Vocabulary/Elements/GameContainer";
import React, { Component } from "react";
import { connect } from "react-redux";
import store from "app/App/store";
import { MINUTES } from "app/Vocabulary/actions/session";
import Link from "app/Router/Link";
import { updateURL } from "app/Router/actions";

const r = (props) => (
  <div id="vocabulary">
    <div>
      <button
        onClick={() => {
          store.getState().vocabulary.deck.sessionDone();
        }}
      >
        Quit
      </button>
      {" • "}
      <Link href="/vocabulary/tutorial">Tutorial</Link>
      {" • "}
      <button
        onClick={() => {
          store.dispatch({ type: "VOCABULARY_AUDIO_ONOFF" });
        }}
      >
        Audio: {props.vocabulary.volume ? "On" : "Off"}
      </button>
    </div>
    <GameContainer />
  </div>
);
export default connect((state) => ({
  vocabulary: state.vocabulary,
}))(r);
