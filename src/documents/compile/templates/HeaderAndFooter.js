import c from "app/app/functions/no-undefined-in-template-literal";
import markdown_to_html from "documents/compile/markdown_to_html";
import { parseVocabularyList } from "documents/compile/vocabulary";
import { EncodeDataInHTML } from "documents/compile/functions/functions";
import { getOrder } from "documents/compile/templates/getOrderOfChapters";
import { URL_title } from "app/app/paths";
import { breadcrumbs } from "documents/compile/templates/breadcrumbs";

export default async (input, header) => {
  let h = "";
  let f = "";
  // console.log(header.vocabulary);
  const vocabulary_data = parseVocabularyList(header.vocabulary);
  const VocabularyHeader = vocabulary_data
    ? `<vocabularyheader data="${EncodeDataInHTML(vocabulary_data)}"/>`
    : "";
  if (vocabulary_data || header.level || header.has_data) {
    h = c`
      <section class="tiny wide">
        ${
          header.level &&
          `<div class="float-right"><level level="${header.level}"/></div>`
        }
        ${breadcrumbs(header)}
        <Spacer space="10"/>
        <div class="center">
          <div>
            ${VocabularyHeader}
            ${
              header.has_data &&
              `<div class="gray small" style="margin:6px 0 10px 0;">Click on words to see their translations.</div>`
            }
          </div>
        </div>
      </section>`;
  }

  let FooterInfoFromPage;
  input = input.replace(/<Footer>([\s\S]+)<\/Footer>/i, (x, data) => {
    FooterInfoFromPage = data;
    return "";
  });

  if (input.trim()) {
    input = c`<main class="${
      /Image position="right/.test(input) && "has-image"
    }">${input}</main>`;
  }

  // input += '<div class="spacer-below-content"></div>';

  /* Automatic prev and next for course articles */
  const url = URL_title(header.title);
  if (header.title !== "Course") {
    const order = await getOrder();
    if (order.includes(url)) {
      const i = order.indexOf(url);
      const prev = i >= 0 && order[i - 1];
      const next = order[i + 1];
      let y = "";
      if (prev) {
        y += `<a href="${prev}" class="button gray small">Previous article</a>`;
      }
      if (next) {
        y += `<a href="${next}" class="button right gray small">Next article</a><div class="clear"></div>`;
      }
      input += `<section>${y}</section>`;
    }
  }

  input += `<section class="vocabulary-footer"><div class="center"> ${VocabularyHeader}</div></section>`;

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
          `<div class="license">You are free to republish this article <span class="license-link">(<a href="https://creativecommons.org/publicdomain/zero/1.0/" rel="noopener" target="_blank">CC0 / public domain</a>)</span></div>`
        }
        ${
          header.published &&
          `<small class="gray">Published ${header.published}</small>`
        }
        
        ${
          header["typos fixed"] &&
          `
            <div class="gray low-lineheight extra-small">
              The version of this article published on Ylhýra includes 
              minor standardizations of orthography or grammar.
            </div>
        `
        }

      </section>`;
  }
  return h + input + f;
};
