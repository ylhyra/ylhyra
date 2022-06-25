import { getSession } from "flashcards/flashcards/actions/session/session";
import React from "react";

export function ProgressBar() {
  const session = getSession();
  const timeRemainingRatio =
    (session.timer.totalTime - session.timer.remainingTime) /
    session.timer.totalTime;
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
}
