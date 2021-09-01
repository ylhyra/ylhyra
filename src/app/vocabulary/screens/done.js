import GameContainer from "app/vocabulary/elements/GameContainer";
import React, { Component } from "react";
import { connect } from "react-redux";
import store from "app/app/store";
import { MINUTES } from "app/vocabulary/actions/session";
import Link from "app/router/Link";

export default () => (
  <div>
    <Link href="/vocabulary">Exit</Link>
    <div>Done for today!</div>
    <div>
      <button
        onClick={() => store.getState().vocabulary.deck.continueStudying()}
      >
        Continue studying
      </button>
    </div>
  </div>
);
