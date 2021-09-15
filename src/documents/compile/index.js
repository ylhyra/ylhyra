import markdown_to_html from "documents/compile/markdown_to_html";
import TranscludeFromTitle from "documents/compile/transclude";
import images from "documents/compile/images";
import WithHeaderAndFooter from "documents/compile/templates/HeaderAndFooter";
import Sections from "documents/compile/templates/Sections";
import Table from "documents/compile/templates/Table";
import { Ref } from "documents/compile/templates/Ref";

export default async (title) => {
  let { output, header } = await TranscludeFromTitle(title);
  if (!output) {
    console.log(`\n"${title}" has no body`);
    return {};
  }
  output = Table(output, header);
  output = Sections(output, header);
  const t = Ref(output, header);
  output = t.output;
  header = t.header;
  output = await images(output);
  output = markdown_to_html(output);
  output = await WithHeaderAndFooter(output, header);
  if (header.classes) {
    output = `<div class="${header.classes.join(" ")}">${output}</div>`;
  }
  if (output.includes("SUBSTITUTION")) {
    console.error(`"${title}" included SUBSTITUTION`);
    if (process.env.NODE_ENV === "production") {
      throw new Error("");
    }
  }

  // console.log(output)
  return { content: output, header };
};
