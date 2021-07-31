import c from "app/App/functions/no-undefined-in-template-literal";
import { URL_title, section_id } from "paths";

export default (text) => {
  if (!/<TOC>/.test(text)) return text;
  text = text.replace(/<TOC>([\s\S]+)<\/TOC>/g, (x, content) => {
    return content.replace(
      /{{(link with percentage|link with vocabulary list|chapter)\|([^|\n]+?)(?:\|([^|\n]+)?)?(?:\|([^|\n]+)?)?}}/g,
      (j, template, link, title, small) => {
        title = title || link.replace("Course/", "");
        return c`<VocabularyStatus header_data="{{${link}>>>vocabulary}}"
          ${
            (template === "link with vocabulary list" ||
              template === "chapter") &&
            'show_words="yes"'
          }
          chapter_url="${URL_title(link)}">${title} ${
          small && `<small>${small}</small>`
        }</VocabularyStatus>`;
      }
    );
  });
  return `<div class="toc">${text}</div>`;
};
