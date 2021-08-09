import c from "app/App/functions/no-undefined-in-template-literal";
import markdown_to_html from "documents/Compile/markdown_to_html";
import { parseVocabularyList } from "documents/Compile/vocabulary.js";
import { EncodeDataInHTML } from "documents/Compile/functions/functions.js";

export default (input, header) => {
  let h = "";
  let f = "";
  // console.log(header.vocabulary);
  const vocabulary_data = parseVocabularyList(header.vocabulary);
  const VocabularyHeader = vocabulary_data
    ? `<section class="content-header">
      <vocabularyheader data="${EncodeDataInHTML(vocabulary_data)}"/>
    </section>`
    : "";
  if (vocabulary_data || header.level || header.has_data) {
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

  input += '<div class="spacer-below-content"></div>';
  input += VocabularyHeader;

  if (
    header.license ||
    header.published ||
    header.reflist ||
    FooterInfoFromPage
  ) {
    f = c`
      <section class="content-footer">
        ${FooterInfoFromPage}
        ${header.reflist && markdown_to_html(header.reflist)}

        ${
          header.license === "CC0" &&
          `<div class="license">You are free to republish this article. <a href="https://creativecommons.org/publicdomain/zero/1.0/" class="license-link" rel="noopener">CC0 / Public Domain</a></div>`
        }
        ${
          header.published &&
          `<small class="gray">Published ${header.published}</small>`
        }

      </section>`;
  }
  return h + input + f;
};
