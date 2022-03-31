import Traverse from "ylhyra/documents/render/Traverse";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import React from "react";

export default (json: HtmlAsJson): React.FC => {
  return Traverse({ json, index: 0 }) || null;
};
