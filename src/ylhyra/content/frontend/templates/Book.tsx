import React from "react";
import Audio from "ylhyra/content/frontend/audio/audioPlayer";
import Spacer from "ylhyra/content/frontend/templates/Spacer";

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
