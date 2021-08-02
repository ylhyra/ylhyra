import c from "app/App/functions/no-undefined-in-template-literal";
import markdown_to_html from "documents/Compile/markdown_to_html";
var btoa = require("btoa");
export default (input, header) => {
  let h = "";
  let f = "";
  // console.log(header.vocabulary);
  const VocabularyHeader = header.vocabulary
    ? `<section class="last content-header">
      <vocabularyheader header_data="${btoa(
        encodeURIComponent(JSON.stringify(header.vocabulary))
      )}"/>
    </section>`
    : "";
  if (header.vocabulary || header.level || header.has_data) {
    h = c`
      ${VocabularyHeader}
      <section class="tiny">
        ${header.level && `<level level="${header.level}"/>`}
        ${
          header.has_data &&
          `<small class="gray">Click on words to see their translations.</small>`
        }
      </section>`;
  }

  let FooterInfoFromPage;
  input = input.replace(/<Footer>([\s\S]+)<\/Footer>/i, (x, data) => {
    FooterInfoFromPage = data;
    return "";
  });

  if (
    header.vocabulary ||
    header.license ||
    header.published ||
    header.reflist ||
    FooterInfoFromPage
  ) {
    f = c`
      ${VocabularyHeader}
      <section class="content-footer">
        ${FooterInfoFromPage}

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
