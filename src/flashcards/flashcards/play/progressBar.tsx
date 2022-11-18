import { observer } from "mobx-react";
import React from "react";

export const ProgressBar = observer(() => {
  const session = store.session;
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
});
