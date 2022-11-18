import { sessionDone } from "flashcards/flashcards/actions/session/sessionDone";
import React from "react";
import { observer } from "mobx-react";
import { store } from "flashcards/store";
import { action } from "mobx";
import { getUserSetting } from "flashcards/user/userSettings.fields";

export const FlashcardsPlayHeader = observer(() => {
  const session = store.session;
  return (
    <div id="vocabulary-header">
      <button className="btn btn-gray" onClick={() => sessionDone()}>
        Quit
      </button>
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
          onClick={action(() => {
            store.userSettings.volume = !getUserSetting("volume");
          })}
        >
          Audio: <b>{getUserSetting("volume") ? "On" : "Off"}</b>
        </button>
      )}
    </div>
  );
});
