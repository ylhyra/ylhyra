// @ts-nocheck
import React from "react";

export default (props) => {
  return (
    <h1 id={props.id}>
      <span>{props.children}</span>
    </h1>
  );
};
