import c from "app/App/functions/no-undefined-in-template-literal.js";

export default (text) => {
  if (!/<TOC>/.test(text)) return text;
  text = text.replace(/<TOC>([\s\S]+)<\/TOC>/g, (x, content) => {
    return content.replace(/^ {2}- (.+)/gm, (j, title) => {
      const m = title.match(/\/(.+?)$/);
      const short_title = m ? m[1] : title;
      return c`  - [[${title}|${short_title}]]  <VocabularyStatus header_data="{{${title}>>>vocabulary}}"/>`;
    });
  });
  return `<div class="toc">${text}</div>`;
};
