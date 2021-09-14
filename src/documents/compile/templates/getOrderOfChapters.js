import generate_html from "documents/compile";
import { getValuesForURL } from "server/content/links";

let cachedUrlOrder;

export const getOrder = async (withDepth, return_unit_to_url) => {
  if (cachedUrlOrder && !withDepth && !return_unit_to_url)
    return cachedUrlOrder;
  const { content } = await generate_html("course");
  let currentUnit = 0;
  let index = 1;
  let urls = [];
  let units_to_url = [];
  let url_to_unit = {};
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
    url_to_unit[url] = currentUnit;
  });
  cachedUrlOrder = urls;
  if (withDepth) {
    return units_to_url;
  }
  if (return_unit_to_url) {
    return url_to_unit;
  }
  return cachedUrlOrder;
};
