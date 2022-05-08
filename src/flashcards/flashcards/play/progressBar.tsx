import { getSession } from "flashcards/flashcards/stores/sessionStore";
import React from "react";

export const ProgressBar = () => {
  const session = getSession();
  const timeRemainingRatio =
    (session.totalTime - session.remainingTime) / session.totalTime;
  return (
    <div className="vocabulary-progress">
      <div className="bar">
        <div className="part done" style={{ flex: timeRemainingRatio }} />
        <div
          className="part remaining"
          style={{ flex: 1 - timeRemainingRatio }}
        />
      </div>
    </div>
  );
};
