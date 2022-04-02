import { HeaderData } from "ylhyra/documents/compile/functions/readContentFile";
import markdown_to_html from "ylhyra/documents/compile/markdown";
import withHeaderAndFooter from "ylhyra/documents/compile/templates/HeaderAndFooter";
import images from "ylhyra/documents/compile/templates/images";
import inflection from "ylhyra/documents/compile/templates/inflection";
import { References } from "ylhyra/documents/compile/templates/References";
import Sections from "ylhyra/documents/compile/templates/Sections";
import Table from "ylhyra/documents/compile/templates/Table";
import Transclude from "ylhyra/documents/compile/transclude";

/**
 * Input: URL or page title
 * Output: Processed HTML with all items transcluded
 */
export default async function generateHtml(url: string): Promise<{
  content: string;
  header?: HeaderData;
}> {
  let { output: content, header } = await Transclude(url);
  if (!content) {
    console.log(`\n"${url}" has no body`);
    return { content: "" };
  }
  content = Table(content);
  content = Sections(content, header);
  const t = References(content, header);
  content = t.content;
  header = t.header;
  content = await images(content);
  content = markdown_to_html(content);
  content = await withHeaderAndFooter(content, header);
  content = await inflection(content);

  content = `<div class="content-wrapper ${
    header.classes?.join(" ") || ""
  }">${content}</div>`;
  if (content.includes("SUBSTITUTION")) {
    console.error(`"${url}" included SUBSTITUTION`);
    if (process.env.NODE_ENV === "production") {
      throw new Error("");
    }
  }

  return { content, header };
}
