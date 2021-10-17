/*
npm run links
*/
// import urlSlug from 'src/app/App/functions/url-slug'
import { ParseHeaderAndBody } from "documents/compile/functions/ParseHeaderAndBody";
import removeUnwantedCharacters from "app/app/functions/languageProcessing/removeUnwantedCharacters";
import { FileSafeTitle, URL_title } from "app/app/paths";
import { content_folder } from "server/paths_backend";
import { getFilesRecursivelySync } from "app/app/functions/getFilesRecursivelySync";
import _ from "underscore";
import fs from "fs";
import path from "path";
import { deck } from "app/vocabulary/actions/deck";
import { initializeDeckFromFile } from "documents/compile/vocabulary/initializeDeckFromFile";
import { getCardIdsFromWords } from "documents/compile/vocabulary/getCardIdsFromWords";

/**
 * @typedef LinkData
 * @property {string} title
 * @property {string} filename
 *   Just the name of the file itself and not its path
 * @property {string} filepath
 * @property {string} redirect_to
 * @property {string} section
 * @property {boolean} shouldBeCreated
 * @property {boolean} shouldBeIndexed
 */
/**
 * @typedef {LinkData} LinkDataWithUrl
 * @property {string} url
 */

/**
 * @type {Object.<string, LinkData>}
 */
const links = {};

// fs.mkdirSync(build_folder)

const run = () => {
  const files = getFilesRecursivelySync(content_folder);
  let vocabulary_entries_in_articles = [];

  if (!files || files.length === 0) {
    console.error("No files!!");
    process.exit();
  }

  for (const filepath of files) {
    if (typeof filepath !== "string") continue;
    let data = fs.readFileSync(filepath, "utf8");
    data = removeUnwantedCharacters(data);
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

    if (header.vocabulary) {
      vocabulary_entries_in_articles = vocabulary_entries_in_articles.concat(
        header.vocabulary
      );
    }
  }
  /* Write links */
  fs.writeFileSync("build/links.json", JSON.stringify(links, null, 2));

  if (!deck) initializeDeckFromFile();
  const missing_vocabulary_entries = vocabulary_entries_in_articles.filter(
    (sentence) => getCardIdsFromWords([sentence]).length === 0
  );
  fs.writeFileSync(
    "build/missing_vocabulary_entries.txt",
    _.uniq(missing_vocabulary_entries).join("\n")
  );
  process.exit();
};

export const shouldBeCreated = (filepath, header) => {
  return (
    !/^(Data|File|Text|Template):/.test(header.title) &&
    !/\/(drafts?|test|newsletter|project\/newest)\//i.test(filepath) &&
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
