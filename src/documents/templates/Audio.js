import React from "react";
import { getDynamicFileUrl } from "app/app/paths";
import Audio from "documents/render/audio";

export default (props) => (
  <Audio src={getDynamicFileUrl(props.src)} inline={"inline" in props} />
);
