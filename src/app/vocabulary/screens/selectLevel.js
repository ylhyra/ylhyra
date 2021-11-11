import React from "react";
import store from "app/app/store";
import Link from "app/router/Link";
import { updateURL } from "app/router/actions/updateURL";
import GameContainer from "app/vocabulary/elements/GameContainer";
import { exitVocabularyScreen } from "app/vocabulary/actions/functions";

export default () => (
  <div id="vocabulary-screen" className="select-level-screen">
    <div id="vocabulary-screen-inner">
      <div id="vocabulary-header">
        <button className="link" onClick={exitVocabularyScreen}>
          Quit
        </button>
      </div>
      <div id="select-level-screen-header">
        What is your current level in Icelandic?
      </div>
      <div id="select-level-buttons">
        <button onClick={() => {}} className="green">
          <h3>
            Complete beginner <span>(A0)</span>
          </h3>
        </button>
        <button onClick={() => {}} className="gray">
          <h3>
            Novice <span>(A1–A2)</span>
          </h3>
          <div>I can not hold a conversation</div>
        </button>
        <button onClick={() => {}} className="gray">
          <h3>
            Intermediate <span>(B1–B2)</span>
          </h3>
          <div>
            I can hold a conversation but I often make grammatical errors
          </div>
        </button>
        <button onClick={() => {}} className="gray">
          <h3>
            Advanced <span>(C1–C2)</span>
          </h3>
          <div>
            I can write near-perfect text but I would like to improve my use of
            idiomatic phrases.
          </div>
        </button>
      </div>
      You can change this setting later
    </div>
  </div>
);
