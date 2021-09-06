/*
node build/server/ylhyra_server.js --generate-links
*/
// import urlSlug from 'src/app/App/functions/url-slug'
import { ParseHeaderAndBody } from "documents/compile/functions/ParseHeaderAndBody";
import RemoveUnwantedCharacters from "app/app/functions/RemoveUnwantedCharacters";
import { FileSafeTitle, URL_title } from "app/app/paths";
import { content_folder } from "server/paths_backend";

var fs = require("fs");
const path = require("path");
let files = [];
const links = {};

// fs.mkdirSync(build_folder)

const run = () => {
  getFilesRecursively(content_folder);

  for (const index of Object.keys(files)) {
    const filepath = files[index];
    if (typeof filepath !== "string") continue;
    let data = fs.readFileSync(filepath, "utf8");
    data = RemoveUnwantedCharacters(data);
    let { header, body } = ParseHeaderAndBody(data);
    if (!header) continue;
    const filename = FileSafeTitle(header.title); //+ '_' + string_hash(body)
    const url = URL_title(header.url || header.title);
    if (url in links) {
      throw new Error(`"${header.title}" already exists`);
    }
    links[url] = {
      filepath,
      filename,
    };
    if (shouldBeCreated(filepath, header)) {
      links[url] = {
        ...links[url],
        shouldBeCreated: true,
        title: header.title,
      };
    }
    if (shouldBeIndexed(filepath, header)) {
      links[url].shouldBeIndexed = true;
    }
    header.redirects &&
      header.redirects.forEach((r) => {
        if (!r) {
          console.log(filepath);
        }
        const [r_title, r_section] = r.split("#");
        if (links[URL_title(r_title)]) return;
        // console.log({r_title})
        links[URL_title(r_title)] = {
          redirect_to: url,
          section: r_section && URL_title(r_section),
        };
      });
    // // console.log(data)
    // fs.writeFileSync(build_folder + `${filename}.html`, body)
    // break;
  }
  /* Write links */
  fs.writeFileSync("build/links.json", JSON.stringify(links, null, 2));
  process.exit();
};

// https://stackoverflow.com/a/66187152 CC BY-SA 4.0
const getFilesRecursively = (directory) => {
  const filesInDirectory = fs.readdirSync(directory);
  for (const file of filesInDirectory) {
    if (file.startsWith(".")) continue;
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      getFilesRecursively(absolute);
    } else {
      if (!file.endsWith(".md")) continue;
      files.push(absolute);
    }
  }
};

export const shouldBeCreated = (filepath, header) => {
  return (
    !/^(Data|File|Text|Template):/.test(header.title) &&
    !/\/(drafts?|test|newsletter)\//i.test(filepath) &&
    header.status !== "draft"
  );
};

export const shouldBeIndexed = (filepath, header) => {
  return (
    shouldBeCreated(filepath, header) &&
    header.index !== "no" &&
    !filepath.includes("/project/")
  );
};

run();
