import fs from "fs";
import { c } from "modules/noUndefinedInTemplateLiteral";
import path from "path";
import { links } from "ylhyra/server/content/links/loadLinks";
import { build_folder } from "ylhyra/server/paths_backend";

const run = async () => {
  let sitemap = "";
  Object.keys(links).forEach((url) => {
    const { filepath, shouldBeIndexed } = links[url];
    if (!shouldBeIndexed) return;
    const mtime = fs.statSync(filepath).mtime;
    sitemap += c`
      <url>
        <loc>https://ylhyra.is${encodeURI(url)}</loc>
        <lastmod>${new Date(mtime).toISOString()}</lastmod>
        ${getPriority(url) && `<priority>${getPriority(url)}</priority>`}
        <changefreq>${getPriority(url) ? `weekly` : `monthly`}</changefreq>
      </url>
    `;
  });

  sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemap}
  </urlset>`;

  fs.writeFileSync(
    path.resolve(build_folder, `./sitemap.xml`),
    sitemap.replace(/^ +/gm, "").replace(/\n\n+/g, "\n")
  );
  process.exit();
};

const getPriority = (url) => {
  if (url === "/") return 1;
  if (url === "/course") return 0.9;
  if (url === "/texts") return 0.8;
};

run();
