import React from "react";
export default (props) => (
  <span className="pron">
    /<span>{props.children}</span>/
  </span>
);
