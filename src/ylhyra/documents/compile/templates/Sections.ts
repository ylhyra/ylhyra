import { c } from "modules/noUndefinedInTemplateLiteral";
import { HeaderData } from "ylhyra/documents/compile/functions/readContentFile";

/**
 * Each section placed into its own container (for styling)
 */
export default (input: string, header: HeaderData) => {
  const isCourse = /Course\//.test(header.title);
  // if (true || is_course) {
  input =
    "SECTION_START" +
    input
      .replace(/^(==[^=](?:.+)?==)$/gm, "SECTION_ENDSECTION_START$1")
      .replace(/(<section)/g, "SECTION_END$1")
      .replace(/(<\/section>)/g, "$1SECTION_START") +
    "SECTION_END";
  input = input.replace(
    /SECTION_START([\s]+|<span.+?\/span>\n)?SECTION_END/g,
    ""
  );

  let i = 0;
  const isContent =
    !header.classes?.includes("not-content") && (true || isCourse);
  input = input.replace(
    /(SECTION_START([\s\S]+?)SECTION_END)/g,
    (j, k, content) => {
      return c`<section class="
          ${isContent && "content"}
          ${i === 0 && "first"}
          ${i++ % 2 !== 0 && "odd"}
          ${/Image.+position="right/.test(content) && "has-image"}
        ">${content}</section>`;
    }
  );
  return input;
};
