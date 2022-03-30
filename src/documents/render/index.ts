import Traverse from "documents/render/Traverse";
import { HtmlAsJson } from "app/app/functions/html2json/types";
import React from "react";

export default (json: HtmlAsJson): React.FC => {
  return Traverse({ json, index: 0 }) || null;
};
