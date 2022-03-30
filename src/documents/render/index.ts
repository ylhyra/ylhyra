import Traverse from "documents/render/Traverse";
import { HtmlAsJson } from "app/app/functions/html2json/types";

export default ({ json /*data*/ }: { json: HtmlAsJson }) => {
  return Traverse({ json, data, index: 0 }) || null;
};
