import React from "react";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import Traverse from "ylhyra/documents/render/Traverse";

export default (json: HtmlAsJson): React.FC => {
  return Traverse(json, 0) || null;
};
