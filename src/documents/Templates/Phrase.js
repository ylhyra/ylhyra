import React from "react";
export default (props) => (
  <div className="phrase zzcard">
    <div>
      <span lang="is">{props.is}</span>
      <small className="gray"> =&nbsp;{props.en}</small>
    </div>
  </div>
);
