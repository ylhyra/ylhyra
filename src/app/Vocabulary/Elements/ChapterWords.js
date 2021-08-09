import React from "react";
import {
  MakeSummaryOfCardStatuses,
  studyParticularIds,
  getCardIdsFromTermIds,
} from "app/Vocabulary/actions/functions";
import { PercentageKnown } from "app/Vocabulary/actions/functions/percentageKnown";

export default (props) => {
  return (
    <div className="toc-vocabulary-list">
      {props.data.sentences.join(" • ")}
    </div>
  );
};
