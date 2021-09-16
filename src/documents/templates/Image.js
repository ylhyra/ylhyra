import React from "react";

export default (props) => {
  return (
    <div
      className={`ylhyra_image ${props.position || "center"}`}
      data-no-translate={true}
    >
      <div style={props.style || {}}>{props.children}</div>
    </div>
  );
};
