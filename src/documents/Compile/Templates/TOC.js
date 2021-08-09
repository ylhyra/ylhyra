import c from "app/App/functions/no-undefined-in-template-literal";
import { URL_title, section_id } from "paths";

export default (text) => {
  return new Promise((resolve) => {
    if (!/<TOC>/.test(text)) return text;
    text = text.replace(/<TOC>([\s\S]+)<\/TOC>/g, (x, content) => {
      return content.replace(
        /{{(link with percentage|link with vocabulary list|chapter)\|([^|\n]+?)(?:\|([^|\n]+)?)?(?:\|([^|\n]+)?)?}}/g,
        (j, template, link, title, small) => {
          title = title || link.replace("Course/", "");
          return c`<Chapter data="{{${link}>>>vocabulary}}"
          ${
            (template === "link with vocabulary list" ||
              template === "chapter") &&
            'show_words="yes"'
          }
          chapter_url="/${URL_title(link)}">${title} ${
            small && `<small>${small}</small>`
          }</Chapter>`;
        }
      );
    });
    resolve(`<div class="toc">${text}</div>`);
  });
};
