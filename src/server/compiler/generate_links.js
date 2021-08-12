/*
node build/server/ylhyra_server.js --generate-links
*/
// import urlSlug from 'src/app/App/functions/url-slug'
import string_hash from "app/App/functions/hash";
import { ParseHeaderAndBody } from "documents/Compile/functions/ParseHeaderAndBody";
import RemoveUnwantedCharacters from "app/App/functions/RemoveUnwantedCharacters";
import { URL_title, FileSafeTitle } from "paths";
import { content_folder, build_folder } from "paths_backend";
var fs = require("fs");
const path = require("path");
let files = [];
const links = {};

// fs.mkdirSync(build_folder)

const run = () => {
  getFilesRecursively(content_folder);

  for (const file in files) {
    if (typeof files[file] !== "string") continue;
    let data = fs.readFileSync(files[file], "utf8");
    data = RemoveUnwantedCharacters(data);
    let { header, body } = ParseHeaderAndBody(data);
    if (!header) continue;
    const filename = FileSafeTitle(header.title); //+ '_' + string_hash(body)
    const url = URL_title(header.url || header.title);
    if (url in links) {
      throw new Error(`"${header.title}" already exists`);
    }
    links[url] = {
      title: header.title,
      filename,
      file: files[file],
      shouldBeCreated: shouldBeCreated(file, header),
      shouldBeIndexed: shouldBeIndexed(file, header),
    };
    header.redirects &&
      header.redirects.forEach((r) => {
        if (!r) {
          console.log(files[file]);
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
  // console.log(done);
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

export const shouldBeCreated = (file, header) => {
  return (
    /^(Data|File|Text|Template):/.test(header.title) ||
    /\/drafts\//i.test(file) ||
    /(newsletter)/i.test(file)
  );
};

export const shouldBeIndexed = (file, header) => {
  return (
    shouldBeCreated(file, header) &&
    header.index !== "no" &&
    !file.includes("/project/")
  );
};

run();
