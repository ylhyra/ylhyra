import { c } from "modules/noUndefinedInTemplateLiteral";
import { replaceAsync } from "modules/replaceAsync";
import { encodeDataInHtml } from "ylhyra/documents/compilation/compileDocument/functions/functions";
import Transclude from "ylhyra/documents/compilation/compileDocument/transclude";
import { parseVocabularyList } from "ylhyra/documents/compilation/compileDocument/vocabulary";
import { formatUrl } from "ylhyra/documents/compilation/links/format/formatUrl";

export default async (text: string): Promise<string> => {
  if (!/<TOC>/.test(text)) return text;
  text = await replaceAsync(
    text,
    /<TOC>([\s\S]+)<\/TOC>/g,
    async (x: string, content: string) => {
      return await replaceAsync(
        content,
        /{{(link with percentage|link with vocabulary list|chapter)\|([^|\n]+?)(?:\|([^|\n]+)?)?(?:\|([^|\n]+)?)?}}/g,
        async (
          j: string,
          template: string,
          link: string,
          title: string,
          small: string
        ) => {
          title = title || link.replace("Course/", "");
          const transclusion = await Transclude(link);
          const vocabulary = transclusion.header?.vocabulary;
          const data = vocabulary
            ? encodeDataInHtml(parseVocabularyList(vocabulary))
            : null;
          return c`<Chapter data="${data}"
              ${
                (template === "link with vocabulary list" ||
                  template === "chapter") &&
                'showWords="yes"'
              }
              chapterUrl="${formatUrl(link)}">${title} ${
            small && `<small>${small}</small>`
          }</Chapter>`;
        }
      );
    }
  );
  return `<div class="toc">${text}</div>`;
};
