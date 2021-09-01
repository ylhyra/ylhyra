import React from "react";
import Link from "app/router/Link";
import Audio from "documents/render/audio";
import { getDynamicFileUrl } from "paths";
export default (props) => {
  return (
    <div className="book" data-translate="true">
      {props.audio && <Audio src={getDynamicFileUrl(props.audio)} />}
      {props.children}
    </div>
  );
};