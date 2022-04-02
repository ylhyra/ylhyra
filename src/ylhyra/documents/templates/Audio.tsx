import React from "react";
import Audio from "ylhyra/documents/render/audio";

export default (props) => <Audio src={props.src} inline={"inline" in props} />;
