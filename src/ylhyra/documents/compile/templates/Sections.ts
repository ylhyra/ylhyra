import c from "ylhyra/app/app/functions/no-undefined-in-template-literal";

export default (input, header) => {
  const is_course = /Course\//.test(header.title);
  if (true || is_course) {
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
      !header.classes?.includes("not-content") && (true || is_course);
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
    // input = input
    //   .split(/==([^=]+)==\n/g)
    //   .map((j, index) => {
    //     return `<div class="section">${j}</div>`;
    //   })
    //   .join("");
  }
  return input;
};
