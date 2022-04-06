import generateHtml from "ylhyra/content/documents/compile/index";
import { getValuesForUrl } from "ylhyra/content/content/links/getValuesForUrl";

type UnitsToUrl = Array<{ unit: number; prefix: number; url: string }>;
type UrlToUnit = { [url: string]: number };
type Urls = string[];

let cachedOrderOfChapters: {
  unitsToUrl: UnitsToUrl;
  urlToUnit: UrlToUnit;
  urls: Urls;
};

/**
 * Returns the order of the chapters in order,
 * to be able to link to Next & Previous chapters.
 */
export const getOrderOfChapters = async (): Promise<
  typeof cachedOrderOfChapters
> => {
  if (cachedOrderOfChapters) return cachedOrderOfChapters;
  const { content } = await generateHtml("course");
  let currentUnit = 0;
  let index = 1;
  let urls: Urls = [];
  let unitsToUrl: UnitsToUrl = [];
  let urlToUnit: UrlToUnit = {};
  content.replace(
    /(?:Unit (\d+)|chapterUrl="(.+?)")/g,
    (x: string, unit: string, _url: string) => {
      if (unit) {
        currentUnit = parseInt(unit);
        index = 1;
        return "";
      }
      // @ts-ignore
      const { url } = getValuesForUrl(_url);
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

  cachedOrderOfChapters = {
    unitsToUrl,
    urlToUnit,
    urls,
  };
  return cachedOrderOfChapters;
};
