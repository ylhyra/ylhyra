import markdown_to_html from "./markdown_to_html";
import transclude from "./transclude";
import images from "./images";
import Footer from "documents/Compile/Templates/Footer.js";

export default async (title) => {
  let { output, header } = await transclude(title);
  if (!output) {
    throw new Error(
      "No output from transclude, possibly files have been changed since last link compilation "
    );
  }
  output = await images(output);
  output = markdown_to_html(output);
  output += Footer(header);
  // console.log(output)
  return { content: output, header };
};
