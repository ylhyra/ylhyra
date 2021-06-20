import React from "react";
import { getDynamicFileUrl } from "paths.js";
import Audio from "documents/Render/Audio";
export default (props) => (
  <Audio src={getDynamicFileUrl(props.src)} inline={"inline" in props} />
);
