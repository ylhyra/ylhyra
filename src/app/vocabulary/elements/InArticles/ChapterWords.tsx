import React from "react";

export default (props) => {
  return (
    <div className="toc-vocabulary-list">
      {props.data.sentences.join(" • ")}
    </div>
  );
};
