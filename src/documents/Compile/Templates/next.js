import _ from "underscore";
import generate_html from "documents/Compile";
import { _links as links } from "server/content/index.js";
import { URL_title, FileSafeTitle } from "paths";
let order;

export const getOrder = async () => {
  if (order) return order;
  const { content, header } = await generate_html("course");
  let u = [];
  content.replace(/chapter_url="(.+?)"/g, (x, url) => {
    url = URL_title(url);
    if (!(url in links)) return;
    url = links[url].redirect_to || url;
    u.push(url);
  });
  order = u;
  return order;
};
