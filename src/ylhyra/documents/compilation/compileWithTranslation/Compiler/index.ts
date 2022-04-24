import { AllHtmlEntities as Entities } from "html-entities";
import ReactDOMServer from "react-dom/server";
import { html2json } from "ylhyra/app/app/functions/html2json";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import { PrepareForCompilation } from "ylhyra/documents/compilation/compileWithTranslation/Compiler/1_PrepereForCompilation";
import { resetIds } from "ylhyra/documents/compilation/compileWithTranslation/Compiler/1_PrepereForCompilation/UpdateID";
import CompileToJsx from "ylhyra/documents/compilation/compileWithTranslation/Compiler/2_CompileToHTML/Traverse";
import { PrepareJSONForReact } from "ylhyra/documents/compilation/compileWithTranslation/Compiler/PrepareJSONForReact";
import { FlattenedData } from "ylhyra/documents/types/types";

/**
 * Two steps:
 *   1. {@link PrepareForCompilation} merges adjacent words
 *   2. {@link CompileToJsx} creates tooltips and inline elements
 */
export const Compiler = ({
  json,
  data,
}: {
  json: HtmlAsJson;
  data?: FlattenedData;
}): HtmlAsJson => {
  resetIds(); // TEMP
  let output;
  output = data ? PrepareForCompilation({ json, data }) : json;
  // console.log(json2html(output));
  output = PrepareJSONForReact(output);
  output = CompileToJsx({ json: output, data });
  output = ReactDOMServer.renderToStaticMarkup(output);
  const entities = new Entities();
  output = entities.decode(output);
  output = html2json(output);
  output = PrepareJSONForReact(output);
  return output;
};
