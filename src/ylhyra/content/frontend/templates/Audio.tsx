import React from "react";
import Audio from "ylhyra/content/frontend/audio/audioPlayer";

export default (props) => <Audio src={props.src} inline={"inline" in props} />;
