import { getDeckById } from "flashcards/flashcards/actions/baseFlashcardsStore/functions";
import { initializeSession } from "flashcards/flashcards/actions/session/initialize";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { sessionDone } from "flashcards/flashcards/actions/session/sessionDone";
import {
  checkForUndoOnKeyDown,
  isSessionUndoable,
  undoSession,
} from "flashcards/flashcards/actions/session/undo";
import { CardElement } from "flashcards/flashcards/play/cardElement";
import { ProgressBar } from "flashcards/flashcards/play/progressBar";
import { DeckId } from "flashcards/flashcards/types";
import { observer } from "mobx-react-lite";
import React, { Component, useEffect } from "react";
import { useParams } from "react-router-dom";

export const FlashcardsPlay = observer(function () {
  let { deckId } = useParams<{ deckId: DeckId }>();
  const deck = getDeckById(deckId! as DeckId);
  if (!deck || !deckId) return <div>No deck with that id.</div>;

  useEffect(() => {
    void initializeSession({ deckId });
  }, [deckId]);

  const session = getSession();
  return (
    <div id="vocabulary-screen">
      <div id="vocabulary-screen-inner">
        <FlashcardsPlayHeader />
        <div id="game-container">
          {session.userFacingError ? (
            <div id="error-message">
              <div>{session.userFacingError}</div>
            </div>
          ) : (
            <>
              <div className="vocabulary-card-outer-container">
                <CardElement key={session.counter} />
              </div>
              <ProgressBar />
            </>
          )}
        </div>
      </div>
    </div>
  );
});

/**
 * Note: This is here since I haven't gotten around to moving the eventListeners
 * to React hooks above.
 */
class FlashcardsPlayHeader extends Component {
  componentDidMount = () => {
    window.addEventListener("keydown", checkForUndoOnKeyDown);
  };
  componentWillUnmount() {
    window.removeEventListener("keydown", checkForUndoOnKeyDown);
  }
  render() {
    return (
      <div id="vocabulary-header">
        <button className="link" onClick={() => sessionDone()}>
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
        {isSessionUndoable() && [
          <div key={1}>&nbsp;&nbsp;•&nbsp;&nbsp;</div>,
          <button
            key={2}
            className="link"
            onClick={() => {
              undoSession();
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
