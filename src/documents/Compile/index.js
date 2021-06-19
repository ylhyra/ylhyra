import markdown_to_html from "./markdown_to_html";
import transclude from "./transclude";
import images from "./images";
var tidy = require("htmltidy2").tidy;

export default async (title) => {
  // console.log(title)
  let { output, header } = await transclude(title);
  // console.log(output)
  if (!output) {
    throw new Error(
      "No output from transclude, possibly files have been changed since last link compilation "
    );
  }
  // await new Promise((resolve) => {
  //   tidy(output, function (err, html) {
  //     output = html
  //     console.log(html)
  //     resolve()
  //   });
  // })
  output = await images(output);
  output = markdown_to_html(output);
  // console.log(output)
  return { content: output, header };
};

// new Promise((resolve, reject) => {
