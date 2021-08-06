import markdown_to_html from "./markdown_to_html";
import TranscludeFromTitle from "./transclude";
import images from "./images";
import WithHeaderAndFooter from "documents/Compile/Templates/HeaderAndFooter";
import Sections from "documents/Compile/Templates/Sections";
import Table from "documents/Compile/Templates/Table";
import { Ref } from "documents/Compile/Templates/Ref";
export default async (title) => {
  let { output, header } = await TranscludeFromTitle(title);
  if (!output) {
    console.log(`\n"${title}" has no body`);
  }
  output = Table(output, header);
  output = Sections(output, header);
  const t = Ref(output, header);
  output = t.output;
  header = t.header;
  output = await images(output);
  output = markdown_to_html(output);
  output = WithHeaderAndFooter(output, header);
  if (header.classes) {
    output = `<div class="${header.classes.join(" ")}">${output}</div>`;
  }

  // console.log(output)
  return { content: output, header };
};
