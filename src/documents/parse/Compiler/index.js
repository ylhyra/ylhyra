import Precompile from "./1_Precompile";
import { reset } from "./1_Precompile/UpdateID";
import { html2json } from "app/app/functions/html2json";
import { AllHtmlEntities as Entities } from "html-entities";
import CompileToHTML from "documents/parse/Compiler/2_CompileToHTML/Traverse";
import PrepareJSONForReact from "./PrepareJSONForReact";
import ReactDOMServer from "react-dom/server";
const entities = new Entities();
// console.log(entities.decode(output));

const TextCompiler = ({ json, data }) => {
  reset(); // TEMP
  let output;
  // console.log(json2html(json));
  output = data ? Precompile({ json, data }) : json;
  // console.log(data);

  output = PrepareJSONForReact(output);
  output = CompileToHTML({ json: output, data });
  // try {
  output = ReactDOMServer.renderToStaticMarkup(output);
  // } catch (e) {}
  output = entities.decode(output);
  //
  // console.log(output);
  output = html2json(output);
  output = PrepareJSONForReact(output);

  // console.log(json2html(output));
  // console.log(JSON.stringify(output, null, 2));
  // output = entities.decode(output);
  return output;
};
export default TextCompiler;
