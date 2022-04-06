import forEachAsync from "modules/forEachAsync";
import { appUrls } from "ylhyra/app/router/appUrls";
import { initializeDeckFromFile } from "ylhyra/documents/compilation/compileDocument/vocabulary/initializeDeckFromFile";
import { links } from "ylhyra/documents/compilation/links/loadLinks.server";
import prerender from "ylhyra/documents/compilation/prerender/prerenderSingle.server";
import { formatUrl } from "ylhyra/documents/compilation/links/format/formatUrl";
import { fileSafeTitle } from "ylhyra/documents/compilation/links/format/fileSafeTitle";

const run = async () => {
  process.stdout.write("Prerendering...");
  initializeDeckFromFile();
  /* Render empty shell */
  let to_render = Object.keys(appUrls);
  // console.log(url_to_info);
  Object.keys(links).forEach((url) => {
    if (!links[url].shouldBeCreated) return;
    to_render.push(url);
  });
  let i = 0;
  await forEachAsync(to_render, async (url) => {
    return new Promise<void>(async (resolve2) => {
      /* Used for testing */
      if (process.env.ONLY && formatUrl(process.env.ONLY) !== url) {
        return resolve2();
      }

      // if (i < 200) {
      //   i++;
      //   resolve2();
      //   return;
      // }
      let filename;
      let isContent;
      if (links[url]) {
        filename = links[url].filename;
        isContent = true;
      } else {
        filename = fileSafeTitle(url);
        isContent = false;
      }
      process.stdout.write("\r\x1b[K");
      process.stdout.write(`${i++} of ${to_render.length} done – ${url}`);
      prerender({
        url,
        filename,
        isContent,
        shouldBeIndexed: links[url]?.shouldBeIndexed,
        callback: resolve2,
      });
    });
  });
  process.exit();
};

run();
