import { HeaderData } from "ylhyra/content/documents/compileDocument/functions/readContentFile";
import markdown_to_html from "ylhyra/content/documents/compileDocument/markdown";
import withHeaderAndFooter from "ylhyra/content/documents/compileDocument/templates/HeaderAndFooter";
import images from "ylhyra/content/documents/compileDocument/templates/images";
import inflection from "ylhyra/content/documents/compileDocument/templates/inflection";
import { References } from "ylhyra/content/documents/compileDocument/templates/References";
import Sections from "ylhyra/content/documents/compileDocument/templates/Sections";
import Table from "ylhyra/content/documents/compileDocument/templates/Table";
import Transclude from "ylhyra/content/documents/compileDocument/transclude";

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
