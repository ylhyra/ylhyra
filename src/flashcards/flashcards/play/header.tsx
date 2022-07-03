import { getSession } from "flashcards/flashcards/actions/session/session";
import { sessionDone } from "flashcards/flashcards/actions/session/sessionDone";
import { checkForUndoOnKeyDown } from "flashcards/flashcards/actions/session/sessionHistory";
import React, { Component } from "react";

/**
 * Note: This is here since I haven't gotten around
 * to moving the eventListeners to React hooks.
 */
export class FlashcardsPlayHeader extends Component {
  componentDidMount = () => {
    window.addEventListener("keydown", checkForUndoOnKeyDown);
  };

  componentWillUnmount() {
    window.removeEventListener("keydown", checkForUndoOnKeyDown);
  }

  render() {
    const session = getSession();
    return (
      <div id="vocabulary-header">
        <button className="btn btn-gray" onClick={() => sessionDone()}>
          Quit
        </button>
        <div>&nbsp;&nbsp;•&nbsp;&nbsp;</div>
        {/*<button*/}
        {/*  className="link"*/}
        {/*  onClick={() => {*/}
        {/*    goToUrl("/vocabulary/tutorial", {*/}
        {/*      dontChangeUrl: true,*/}
        {/*    });*/}
        {/*  }}*/}
        {/*>*/}
        {/*  Tutorial*/}
        {/*</button>*/}
        {session.history.isUndoable() && [
          <div key={1}>&nbsp;&nbsp;•&nbsp;&nbsp;</div>,
          <button
            key={2}
            className="link"
            onClick={() => {
              session.history.undo();
            }}
          >
            Undo
          </button>,
        ]}
        {/*<div className="spacer" />*/}
        {/*{session?.cards.some((j) => getSound(j.getId())) && (*/}
        {/*  <button*/}
        {/*    className="link"*/}
        {/*    onClick={() => {*/}
        {/*      store.dispatch({ type: "VOCABULARY_AUDIO_ONOFF" });*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    Audio: <b>{this.props.vocabulary.volume ? "On" : "Off"}</b>*/}
        {/*  </button>*/}
        {/*)}*/}
      </div>
    );
  }
}
