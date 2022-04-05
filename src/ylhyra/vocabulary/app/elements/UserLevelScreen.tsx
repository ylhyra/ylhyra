import React, { Component } from "react";
import { connect } from "react-redux";
import { deck } from "ylhyra/vocabulary/app/actions/deck";
import { exitVocabularyScreen } from "ylhyra/vocabulary/app/actions/functions";
import {
  getUserLevel,
  setUserLevel,
} from "ylhyra/vocabulary/app/actions/userLevel";
import {
  USER_LEVEL_ADVANCED,
  USER_LEVEL_BEGINNER,
  USER_LEVEL_INTERMEDIATE,
  USER_LEVEL_NOVICE,
} from "ylhyra/vocabulary/app/constants";

class X extends Component<{ vocabulary: any; route: any }> {
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
                onClick={() => this.set(USER_LEVEL_BEGINNER)}
                className={userLevel <= USER_LEVEL_BEGINNER ? "green" : "gray"}
              >
                <h3>
                  Beginner <span>(A0)</span>
                </h3>
              </button>
              <button
                onClick={() => this.set(USER_LEVEL_NOVICE)}
                className={
                  getUserLevel() === USER_LEVEL_NOVICE ? "green" : "gray"
                }
              >
                <h3>
                  Novice <span>(A1-A2)</span>
                </h3>
                <div>I can write simple sentences</div>
              </button>
              <button
                onClick={() => this.set(USER_LEVEL_INTERMEDIATE)}
                className={
                  getUserLevel() === USER_LEVEL_INTERMEDIATE ? "green" : "gray"
                }
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
                onClick={() => this.set(USER_LEVEL_ADVANCED)}
                className={
                  getUserLevel() === USER_LEVEL_ADVANCED ? "green" : "gray"
                }
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
export default connect((state: any) => ({
  route: state.route,
  vocabulary: state.vocabulary,
}))(X);
