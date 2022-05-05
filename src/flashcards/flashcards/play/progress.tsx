import React from "react";
import { getPercentageDoneOfSession } from "flashcards/flashcards/actions/session/functions";

export const Progress = () => {
  const percentageDone = getPercentageDoneOfSession();
  return (
    <div className="vocabulary-progress">
      <div className="bar">
        <div className="part done" style={{ flex: percentageDone }} />
        <div
          className="part remaining"
          style={{ flex: 100 - percentageDone }}
        />
      </div>
    </div>
  );
};
