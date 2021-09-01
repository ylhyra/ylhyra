import React from "react";

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
