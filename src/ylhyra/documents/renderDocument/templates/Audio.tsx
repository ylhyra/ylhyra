import React from "react";
import Audio from "ylhyra/documents/renderDocument/audio/audioPlayer";

export default (props) => <Audio src={props.src} inline={"inline" in props} />;
