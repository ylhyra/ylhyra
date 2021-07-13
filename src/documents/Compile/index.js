import markdown_to_html from "./markdown_to_html";
import TranscludeFromTitle from "./transclude";
import images from "./images";
import WithHeaderAndFooter from "documents/Compile/Templates/HeaderAndFooter.js";
import Sections from "documents/Compile/Templates/Sections.js";
import { Ref } from "documents/Compile/Templates/Ref.js";
export default async (title) => {
  let { output, header } = await TranscludeFromTitle(title);
  if (!output) {
    console.log(`\n"${title}" has no body`);
  }
  output = Sections(output, header);
  const t = Ref(output, header);
  output = t.output;
  header = t.header;
  output = await images(output);
  output = markdown_to_html(output);
  output = WithHeaderAndFooter(output, header);
  // console.log(output)
  return { content: output, header };
};
