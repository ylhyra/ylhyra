import markdown_to_html from "./markdown_to_html";
import TranscludeFromTitle from "./transclude";
import images from "./images";
import WithHeaderAndFooter from "documents/Compile/Templates/HeaderAndFooter.js";
import Sections from "documents/Compile/Templates/Sections.js";
export default async (title) => {
  let { output, header } = await TranscludeFromTitle(title);
  if (!output) {
    throw new Error(
      `No output from transclude "${title}", possibly files have been changed since last link compilation`
    );
  }
  output = Sections(output, header);
  output = await images(output);
  output = markdown_to_html(output);
  output = WithHeaderAndFooter(output, header);
  // console.log(output)
  return { content: output, header };
};
