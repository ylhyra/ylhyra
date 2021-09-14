import React from "react";

export default (props) => {
  return (
    <div
      className={`ylhyra_image ${props.position || ""}`}
      style={props.style || {}}
      data-no-translate={true}
    >
      {props.children}
    </div>
  );
};
