import { html2json, json2html } from "app/App/functions/html2json";
import c from "app/App/functions/no-undefined-in-template-literal.js";
import markdown_to_html from "documents/Compile/markdown_to_html.js";

export default (json) => {
  return json;
  // let text = json2html({ node: "root", child: json.child });
  // // console.log(text);
  // let output = text.replace(/^ {2}- (.+)/gm, (x, title) => {
  //   return c`  - [[${title}]]  <VocabularyStatus header_data="{{${title}>>>vocabulary}}"/>`;
  // });
  // return {
  //   node: "text",
  //   text: output,
  // };
};
