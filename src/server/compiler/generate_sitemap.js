"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const no_undefined_in_template_literal_1 = __importDefault(require("app/app/functions/no-undefined-in-template-literal"));
const loadLinks_1 = require("server/content/loadLinks");
const paths_backend_1 = require("server/paths_backend");
const path = require("path");
var fs = require("fs");
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    let sitemap = "";
    Object.keys(loadLinks_1.links).forEach((url) => {
        const { filepath, shouldBeIndexed } = loadLinks_1.links[url];
        if (!shouldBeIndexed)
            return;
        const mtime = fs.statSync(filepath).mtime;
        sitemap += (0, no_undefined_in_template_literal_1.default) `
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
    fs.writeFileSync(path.resolve(paths_backend_1.build_folder, `./sitemap.xml`), sitemap.replace(/^ +/gm, "").replace(/\n\n+/g, "\n"));
    process.exit();
});
const getPriority = (url) => {
    if (url === "/")
        return 1;
    if (url === "/course")
        return 0.9;
    if (url === "/texts")
        return 0.8;
};
run();
