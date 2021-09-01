import React from "react";
import Link from "app/router/Link";

export default (props) => {
  return (
    <div
      className={`ylhyra_image ${props.position || ""}`}
      style={props.style || {}}
    >
      {props.children}
    </div>
  );
};
