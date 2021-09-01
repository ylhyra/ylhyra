import React from "react";
import {
  studyParticularIds,
  getCardIdsFromTermIds,
} from "app/vocabulary/actions/functions";
import { PercentageKnown } from "app/vocabulary/actions/functions/percentageKnown";

export default (props) => {
  return (
    <div className="toc-vocabulary-list">
      {props.data.sentences.join(" • ")}
    </div>
  );
};
