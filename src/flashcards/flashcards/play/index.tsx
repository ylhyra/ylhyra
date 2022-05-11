import { getDeckById } from "flashcards/flashcards/actions/baseFlashcardsStore/_functions";
import { getFlashcardsStore } from "flashcards/flashcards/actions/baseFlashcardsStore/flashcardsStore";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import {
  checkForUndoOnKeyDown,
  isSessionUndoable,
  undoSession,
} from "flashcards/flashcards/actions/session/_functions/undo";
import { initializeSession } from "flashcards/flashcards/actions/session/initialize";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { sessionDone } from "flashcards/flashcards/actions/session/sessionDone";
import { CardElement } from "flashcards/flashcards/play/cardElement";
import { ProgressBar } from "flashcards/flashcards/play/progressBar";
import { DeckId } from "flashcards/flashcards/types";
import { observer } from "mobx-react-lite";
import { values } from "modules/typescript/objectEntries";
import React, { Component, useEffect } from "react";
import { useParams } from "react-router-dom";

export const FlashcardsPlay = observer(function () {
  let { deckId } = useParams<{ deckId: DeckId }>();
  let decks: Deck[];
  if (deckId === "all") {
    decks = values(getFlashcardsStore().decks);
  } else {
    const deck = getDeckById(deckId! as DeckId);
    if (!deck) {
      return <div>No deck with that id.</div>;
    }
    decks = [deck];
  }

  useEffect(() => {
    void initializeSession(decks);
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
