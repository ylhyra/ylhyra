import { html2json } from "ylhyra/app/app/functions/html2json";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import Precompile from "ylhyra/documents/parse/Compiler/1_Precompile";
import { resetIds } from "ylhyra/documents/parse/Compiler/1_Precompile/UpdateID";
import CompileToHTML from "ylhyra/documents/parse/Compiler/2_CompileToHTML/Traverse";
import PrepareJSONForReact from "ylhyra/documents/parse/Compiler/PrepareJSONForReact";
import { FlattenedData } from "ylhyra/documents/parse/types";
import { AllHtmlEntities as Entities } from "html-entities";
import ReactDOMServer from "react-dom/server";

const entities = new Entities();

const TextCompiler = ({
  json,
  data,
}: {
  json: HtmlAsJson;
  data?: FlattenedData;
}): HtmlAsJson => {
  resetIds(); // TEMP
  let output;
  output = data ? Precompile({ json, data }) : json;
  output = PrepareJSONForReact(output);
  output = CompileToHTML({ json: output });
  output = ReactDOMServer.renderToStaticMarkup(output);
  output = entities.decode(output);
  output = html2json(output);
  output = PrepareJSONForReact(output);
  return output;
};

export default TextCompiler;
