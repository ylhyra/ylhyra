import c from "app/App/functions/no-undefined-in-template-literal";
import { URL_title, section_id } from "paths";
import Transclude from "documents/Compile/transclude";
import { EncodeDataInHTML } from "documents/Compile/functions/functions";
import { parseVocabularyList } from "documents/Compile/vocabulary";

export default async (text) => {
  if (!/<TOC>/.test(text)) return text;
  text = await replaceAsync(
    text,
    /<TOC>([\s\S]+)<\/TOC>/g,
    async (x, content) => {
      return await replaceAsync(
        content,
        /{{(link with percentage|link with vocabulary list|chapter)\|([^|\n]+?)(?:\|([^|\n]+)?)?(?:\|([^|\n]+)?)?}}/g,
        async (j, template, link, title, small) => {
          title = title || link.replace("Course/", "");
          const transclusion = await Transclude(link, 1);
          // console.log(transclusion);
          const vocabulary = transclusion.header?.vocabulary;
          const data = vocabulary
            ? EncodeDataInHTML(parseVocabularyList(vocabulary))
            : null;
          return c`<Chapter data="${data}"
              ${
                (template === "link with vocabulary list" ||
                  template === "chapter") &&
                'show_words="yes"'
              }
              chapter_url="${URL_title(link)}">${title} ${
            small && `<small>${small}</small>`
          }</Chapter>`;
        }
      );
    }
  );
  return `<div class="toc">${text}</div>`;
};

// https://stackoverflow.com/questions/33631041/javascript-async-await-in-replace
async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}
