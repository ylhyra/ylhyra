import generateHtml from "documents/compile";
import { getValuesForURL } from "server/content/links";

let cachedUrlOrder: any;

export const getOrderOfChapters = async (
  withDepth?: Boolean,
  returnUnitToUrl?: Boolean
) => {
  if (cachedUrlOrder && !withDepth && !returnUnitToUrl) return cachedUrlOrder;
  const { content } = await generateHtml("course");
  let currentUnit = 0;
  let index = 1;
  let urls: string[] = [];
  let unitsToUrl: Array<{ unit: number; prefix: number; url: string }> = [];
  let urlToUnit: { [url: string]: number } = {};
  content.replace(
    /(?:Unit (\d+)|chapter_url="(.+?)")/g,
    (x: string, unit: string, _url: string) => {
      if (unit) {
        currentUnit = parseInt(unit);
        index = 1;
        return "";
      }
      const { url } = getValuesForURL(_url);
      if (!url) return "";
      urls.push(url);
      unitsToUrl.push({
        unit: currentUnit,
        prefix: index++,
        url,
      });
      urlToUnit[url] = currentUnit;
      return "";
    }
  );
  cachedUrlOrder = urls;
  if (withDepth) {
    return unitsToUrl;
  }
  if (returnUnitToUrl) {
    return urlToUnit;
  }
  return cachedUrlOrder;
};
