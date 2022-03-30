import c from "app/app/functions/no-undefined-in-template-literal";
import { replaceAsync } from "app/app/functions/replaceAsync";
import { URL_title } from "app/app/paths";
import { encodeDataInHtml } from "documents/compile/functions/functions";
import Transclude from "documents/compile/transclude";
import { parseVocabularyList } from "documents/compile/vocabulary";

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
