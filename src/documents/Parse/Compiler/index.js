import Precompile from "./1_Precompile";
import { reset } from "./1_Precompile/UpdateID";
import { html2json, json2html } from "app/App/functions/html2json";
import { AllHtmlEntities as Entities } from "html-entities";
import CompileToHTML from "documents/Parse/Compiler/2_CompileToHTML/Traverse";
import PrepareJSONForReact from "./PrepareJSONForReact";
const entities = new Entities();

const TextCompiler = ({ json, data }) => {
  reset(); // TEMP
  let output;
  // console.log(json2html(json))
  output = data ? Precompile({ json, data }) : json;
  // console.log((data))

  output = CompileToHTML({ json: output, data });
  output = html2json(json2html(output));

  // console.log(json2html(output));
  // console.log(JSON.stringify(output, null, 2));
  // output = entities.decode(output)
  output = PrepareJSONForReact(output);
  return output;
};

export default TextCompiler;
