import { HeaderData } from "ylhyra/documents/compile/functions/ParseHeaderAndBody";
import images from "ylhyra/documents/compile/images";
import markdown_to_html from "ylhyra/documents/compile/markdown_to_html";
import WithHeaderAndFooter from "ylhyra/documents/compile/templates/HeaderAndFooter";
import inflection from "ylhyra/documents/compile/templates/inflection";
import { References } from "ylhyra/documents/compile/templates/References";
import Sections from "ylhyra/documents/compile/templates/Sections";
import Table from "ylhyra/documents/compile/templates/Table";
import Transclude from "ylhyra/documents/compile/transclude";

export default async function generateHtml(title: string): Promise<{
  content: string;
  header?: HeaderData;
}> {
  let { output: content, header } = await Transclude(title);
  if (!content) {
    console.log(`\n"${title}" has no body`);
    return { content: "" };
  }
  content = Table(content);
  content = Sections(content, header);
  const t = References(content, header);
  content = t.content;
  header = t.header;
  content = await images(content);
  content = markdown_to_html(content);
  content = await WithHeaderAndFooter(content, header);
  content = await inflection(content);
  content = `<div class="content-wrapper ${
    header.classes?.join(" ") || ""
  }">${content}</div>`;
  if (content.includes("SUBSTITUTION")) {
    console.error(`"${title}" included SUBSTITUTION`);
    if (process.env.NODE_ENV === "production") {
      throw new Error("");
    }
  }

  return { content, header };
}
