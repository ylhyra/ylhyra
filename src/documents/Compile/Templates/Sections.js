export default (input, header) => {
  if (/Course\//.test(header.title)) {
    input =
      "SECTION_START" +
      input.replace(/^(==[^=]+==)$/gm, "SECTION_ENDSECTION_START$1") +
      "SECTION_END";
    input = input.replace(
      /SECTION_START([\s]+|<span.+?\/span>\n)?SECTION_END/g,
      ""
    );
    console.log(input.slice(0, 200));

    let i = 0;
    input = input.replace(
      /(SECTION_START([\s\S]+?)SECTION_END)/g,
      (j, k, content) => {
        return `<Section class="content ${
          i++ % 2 === 0 ? "" : "odd"
        }">${content}</Section>`;
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
