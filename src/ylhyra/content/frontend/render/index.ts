import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import Traverse from "ylhyra/content/frontend/render/traverse";
import { Jsx } from "modules/typescript/jsx";

export default (json: HtmlAsJson): Jsx => {
  return Traverse(json, 0) || null;
};
