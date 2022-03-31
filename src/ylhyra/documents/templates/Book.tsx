import Audio from "ylhyra/documents/render/audio";
import Spacer from "ylhyra/documents/templates/Spacer";
import React from "react";

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
