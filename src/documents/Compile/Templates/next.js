import _ from "underscore";
import generate_html from "documents/Compile";
import { getValuesForURL } from "server/content/links.js";
import { URL_title, FileSafeTitle } from "paths";
let order;

export const getOrder = async () => {
  if (order) return order;
  const { content, header } = await generate_html("course");
  let u = [];
  content.replace(/chapter_url="(.+?)"/g, (x, _url) => {
    const { url } = getValuesForURL(_url);
    if (!url) return;
    u.push(url);
  });
  order = u;
  return order;
};
