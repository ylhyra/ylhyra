import { getSession } from "flashcards/flashcards/actions/session/session";
import { sessionDone } from "flashcards/flashcards/actions/session/sessionDone";
import React from "react";
import { observer } from "mobx-react";
import { store } from "flashcards/store";

export const FlashcardsPlayHeader = observer(() => {
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
      <div className="spacer" />
      {session?.cards.some((card) => card.hasSound) && (
        <button
          className="link"
          onClick={() => {
            store.userSettings.volume = !store.userSettings.volume;
          }}
        >
          Audio: <b>{store.userSettings.volume ? "On" : "Off"}</b>
        </button>
      )}
    </div>
  );
});
