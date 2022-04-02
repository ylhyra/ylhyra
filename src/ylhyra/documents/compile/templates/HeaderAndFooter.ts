import c from "ylhyra/app/app/functions/no-undefined-in-template-literal";
import { URL_title } from "ylhyra/app/app/paths";
import { encodeDataInHtml } from "ylhyra/documents/compile/functions/functions";
import { HeaderData } from "ylhyra/documents/compile/functions/ParseHeaderAndBody";
import markdown_to_html from "ylhyra/documents/compile/markdown";
import { breadcrumbs } from "ylhyra/documents/compile/templates/breadcrumbs";
import { getOrderOfChapters } from "ylhyra/documents/compile/templates/getOrderOfChapters";
import { parseVocabularyList } from "ylhyra/documents/compile/vocabulary";

export default async (input: string, header: HeaderData) => {
  let h = "";
  let f = "";
  const vocabularyData = parseVocabularyList(header.vocabulary);
  const VocabularyHeader = vocabularyData
    ? `<vocabularyheader data="${encodeDataInHtml(vocabularyData)}"/>`
    : "";

  const shouldShowVocabularyHeaderAbove =
    // true ||
    !header.title.startsWith("Course/") &&
    (header.has_data || input.length > 4000);

  if (true || vocabularyData || header.level || header.has_data) {
    h = c`
      <section class="tiny wide">
        ${
          header.level &&
          `<div class="float-right"><level level="${header.level}"/></div>`
        }
        ${await breadcrumbs(header)}
        <Spacer space="10"/>
        <div class="center">
          <div>
            ${shouldShowVocabularyHeaderAbove && VocabularyHeader}
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

  if (VocabularyHeader) {
    input += `<section class="vocabulary-footer"><div class="center">${VocabularyHeader}</div></section>`;
  }

  /* Automatic prev and next for course articles */
  const url = URL_title(header.title);
  if (header.title !== "Course") {
    const order = (await getOrderOfChapters()).urls;
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
          c`<div class="license">You are free to republish this article <span class="license-link">(${
            input.includes("<Inflection") && "Text: "
          }<a href="https://creativecommons.org/publicdomain/zero/1.0/" rel="noopener" target="_blank">CC0 / public domain</a>${
            input.includes("<Inflection") &&
            '; <a href="https://bin.arnastofnun.is/DMII/LTdata/k-format/" rel="nofollow">BÍN</a> tables: <a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="nofollow">CC BY-SA 4.0</a>'
          })</span></div>`
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
