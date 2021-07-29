import c from "app/App/functions/no-undefined-in-template-literal";

export default (text) => {
  if (!/<TOC>/.test(text)) return text;
  text = text.replace(/<TOC>([\s\S]+)<\/TOC>/g, (x, content) => {
    return content.replace(/^- ([^|\n]+)(?:\|(.+))?/gm, (j, link, title) => {
      // const m = link.match(/\/(.+?)$/);
      title = title || link.replace("Course/", "");
      return c`<VocabularyStatus header_data="{{${link}>>>vocabulary}}">
        [[${link}|${title}]]
      </VocabularyStatus>`;
    });
  });
  return `<div class="toc">${text}</div>`;
};
