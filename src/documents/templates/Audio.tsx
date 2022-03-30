import Audio from "documents/render/audio";
import React from "react";

export default (props) => <Audio src={props.src} inline={"inline" in props} />;
