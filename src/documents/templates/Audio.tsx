import React from "react";
import Audio from "documents/render/audio";

export default (props) => <Audio src={props.src} inline={"inline" in props} />;
