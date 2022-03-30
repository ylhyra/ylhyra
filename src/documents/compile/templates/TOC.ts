import c from "app/app/functions/no-undefined-in-template-literal";
import { replaceAsync } from "app/app/functions/replaceAsync";
import { URL_title } from "app/app/paths";
import { EncodeDataInHTML } from "documents/compile/functions/functions";
import Transclude from "documents/compile/transclude";
import { parseVocabularyList } from "documents/compile/vocabulary";

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
          const transclusion = await Transclude(link);
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
