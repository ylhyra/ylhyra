import forEachAsync from "app/app/functions/array-foreach-async";
import { FileSafeTitle, URL_title } from "app/app/paths";
import { app_urls } from "app/router/appUrls";
import { initializeDeckFromFile } from "documents/compile/vocabulary/initializeDeckFromFile";
import prerender from "server/compiler/prerender_single";
import { links } from "server/content/loadLinks";

const run = async () => {
  process.stdout.write("Prerendering...");
  initializeDeckFromFile();
  /* Render empty shell */
  let to_render = Object.keys(app_urls);
  // console.log(url_to_info);
  Object.keys(links).forEach((url) => {
    if (!links[url].shouldBeCreated) return;
    to_render.push(url);
  });
  let i = 0;
  await forEachAsync(to_render, async (url) => {
    return new Promise(async (resolve2) => {
      /* Used for testing */
      if (process.env.ONLY && URL_title(process.env.ONLY) !== url) {
        return resolve2();
      }

      // if (i < 200) {
      //   i++;
      //   resolve2();
      //   return;
      // }
      let filename;
      let is_content;
      if (links[url]) {
        filename = links[url].filename;
        is_content = true;
      } else {
        filename = FileSafeTitle(url);
        is_content = false;
      }
      process.stdout.write("\r\x1b[K");
      process.stdout.write(`${i++} of ${to_render.length} done – ${url}`);
      prerender({
        url,
        filename,
        css: true,
        is_content,
        shouldBeIndexed: links[url]?.shouldBeIndexed,
        callback: resolve2,
      });
    });
  });
  process.exit();
};

run();
