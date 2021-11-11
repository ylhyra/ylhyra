import React from "react";
import { exitVocabularyScreen } from "app/vocabulary/actions/functions";
import {
  ADVANCED,
  BEGINNER,
  INTERMEDIATE,
  NOVICE,
  setUserLevel,
} from "app/vocabulary/actions/userLevel/index";

export default () => (
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
          <button onClick={() => setUserLevel(BEGINNER)} className="green">
            <h3>
              Beginner <span>(A0)</span>
            </h3>
          </button>
          <button onClick={() => setUserLevel(NOVICE)} className="gray">
            <h3>
              Novice <span>(A1-A2)</span>
            </h3>
            <div>I can write simple sentences</div>
          </button>
          <button onClick={() => setUserLevel(INTERMEDIATE)} className="gray">
            <h3>
              Intermediate <span>(B1-B2)</span>
            </h3>
            <div>
              I can easily hold a conversation <br />
              and I know most inflection tables
            </div>
          </button>
          <button onClick={() => setUserLevel(ADVANCED)} className="gray">
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
