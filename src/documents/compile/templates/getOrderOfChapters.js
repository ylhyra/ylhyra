import generate_html from "documents/compile";
import { getValuesForURL } from "server/content/links";
let order;

export const getOrder = async (withDepth) => {
  if (order) return order;
  const { content } = await generate_html("course");
  let currentUnit = 0;
  let index = 1;
  let urls = [];
  let units_to_url = [];
  content.replace(/(?:Unit (\d+)|chapter_url="(.+?)")/g, (x, unit, _url) => {
    if (unit) {
      currentUnit = unit;
      // index = 1;
      return;
    }
    const { url } = getValuesForURL(_url);
    if (!url) return;
    urls.push(url);
    units_to_url.push({
      unit: currentUnit,
      prefix: index++,
      url,
    });
  });
  order = urls;
  if (withDepth) {
    return units_to_url;
  }
  return order;
};
