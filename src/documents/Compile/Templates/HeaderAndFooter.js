import c from "app/App/functions/no-undefined-in-template-literal.js";
import markdown_to_html from "documents/Compile/markdown_to_html.js";
export default (input, header) => {
  let h = "";
  let f = "";
  if (header.vocabulary || header.level || header.has_data) {
    h = c`<section class="content-header">
      ${header.vocabulary && `<vocabularyheader/>`}
      ${header.level && `<level level="${header.level}"/>`}
      ${
        header.has_data &&
        `<small class="gray">Click on words to see their translations.</small>`
      }
    </section>`;
  }
  if (
    header.vocabulary ||
    header.license ||
    header.published ||
    header.reflist
  ) {
    f = c`<section class="last">
      ${header.vocabulary && `<vocabularyheader/>`}
    </section>
    <section class="content-footer">
      ${
        header.license === "CC0" &&
        `<div class="license">You are free to republish this article. <a href="https://creativecommons.org/publicdomain/zero/1.0/" class="license-link" rel="noopener">CC0 / Public Domain</a></div>`
      }
      ${
        header.published &&
        `<small class="gray">Published ${header.published}</small>`
      }

      ${header.reflist && markdown_to_html(header.reflist)}
    </section>`;
  }
  return h + input + f;
};