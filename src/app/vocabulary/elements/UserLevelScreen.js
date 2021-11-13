import React, { Component } from "react";
import { exitVocabularyScreen } from "app/vocabulary/actions/functions";
import {
  ADVANCED,
  BEGINNER,
  getUserLevel,
  INTERMEDIATE,
  NOVICE,
  setUserLevel,
} from "app/vocabulary/actions/level";
import { connect } from "react-redux";
import { deck } from "app/vocabulary/actions/deck";

class X extends Component {
  set(level) {
    setUserLevel(level);
    if (this.props.route.pathname === "/vocabulary/difficulty") {
      exitVocabularyScreen();
    }
  }
  render() {
    if (!deck) return null;
    const userLevel = getUserLevel();
    return (
      <div id="vocabulary-screen" className="select-level-screen">
        <div id="vocabulary-screen-inner">
          <div id="vocabulary-header">
            <button className="link" onClick={exitVocabularyScreen}>
              Back
            </button>
          </div>
          <div id="game-container">
            <div id="select-level-screen-header">
              What is your current <br />
              level in Icelandic?
            </div>
            <div id="select-level-buttons">
              <button
                onClick={() => this.set(BEGINNER)}
                className={userLevel <= BEGINNER ? "green" : "gray"}
              >
                <h3>
                  Beginner <span>(A0)</span>
                </h3>
              </button>
              <button
                onClick={() => this.set(NOVICE)}
                className={getUserLevel() === NOVICE ? "green" : "gray"}
              >
                <h3>
                  Novice <span>(A1-A2)</span>
                </h3>
                <div>I can write simple sentences</div>
              </button>
              <button
                onClick={() => this.set(INTERMEDIATE)}
                className={getUserLevel() === INTERMEDIATE ? "green" : "gray"}
              >
                <h3>
                  Intermediate <span>(B1-B2)</span>
                </h3>
                <div>
                  I can easily hold a conversation <br />
                  and I know most inflection tables
                </div>
              </button>
              <button
                onClick={() => this.set(ADVANCED)}
                className={getUserLevel() === ADVANCED ? "green" : "gray"}
              >
                <h3>
                  Advanced <span>(B2+)</span>
                </h3>
                <div>I can write nearly error-free text</div>
              </button>
            </div>
            <div className="smaller gray center">
              (You can change this setting later)
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect((state) => ({
  route: state.route,
  vocabulary: state.vocabulary,
}))(X);
