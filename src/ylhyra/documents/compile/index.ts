import images from "ylhyra/documents/compile/images";
import markdown_to_html from "ylhyra/documents/compile/markdown_to_html";
import WithHeaderAndFooter from "ylhyra/documents/compile/templates/HeaderAndFooter";
import inflection from "ylhyra/documents/compile/templates/inflection";
import { References } from "ylhyra/documents/compile/templates/References";
import Sections from "ylhyra/documents/compile/templates/Sections";
import Table from "ylhyra/documents/compile/templates/Table";
import TranscludeFromTitle from "ylhyra/documents/compile/transclude";

export default async function generateHtml(title: string) {
  let { output, header } = await TranscludeFromTitle(title);
  if (!output) {
    console.log(`\n"${title}" has no body`);
    return { content: "" };
  }
  output = Table(output);
  output = Sections(output, header);
  const t = References(output, header);
  output = t.output;
  header = t.header;
  output = await images(output);
  output = markdown_to_html(output);
  output = await WithHeaderAndFooter(output, header);
  output = await inflection(output);
  output = `<div class="content-wrapper ${
    header.classes?.join(" ") || ""
  }">${output}</div>`;
  if (output.includes("SUBSTITUTION")) {
    console.error(`"${title}" included SUBSTITUTION`);
    if (process.env.NODE_ENV === "production") {
      throw new Error("");
    }
  }

  return { content: output, header };
}
