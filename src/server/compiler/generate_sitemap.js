import c from "app/App/functions/no-undefined-in-template-literal";
import { content_folder, build_folder } from "paths_backend";
import { links } from "server/content/links.js";
var fs = require("fs");
const path = require("path");

const run = async () => {
  let sitemap = "";
  Object.keys(links).forEach((url) => {
    const { title, file, filename, shouldBeCreated } = links[url];
    if (!shouldBeCreated) return;
    const mtime = fs.statSync(file).mtime;
    sitemap += c`
      <url>
        <loc>https://ylhyra.is${url}</loc>
        <lastmod>${mtime}</lastmod>
        ${getPriority(url) && `<priority>${getPriority(url)}</priority>`}
        <changefreq>monthly</changefreq>
      </url>
    `;
  });

  sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemap}
  </urlset>`;

  fs.writeFileSync(
    path.resolve(build_folder, `./sitemap.xml`),
    sitemap.replace(/^ +/gm, "")
  );
};

const getPriority = (url) => {
  if (url === "/") return 1;
  if (url === "/course") return 0.9;
  if (url === "/texts") return 0.9;
};

run();
