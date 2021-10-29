import React from "react";
import Audio from "documents/render/audio";
import Spacer from "documents/templates/Spacer";

export default (props) => {
  return (
    <div className="book" data-translate="true">
      <Spacer space={20} />
      <div className="center">{props.audio && <Audio src={props.audio} />}</div>
      <Spacer space={10} />
      {props.children}
    </div>
  );
};
