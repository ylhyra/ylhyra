import fs from "fs";
import { getFilesRecursivelySync } from "modules/getFilesRecursivelySync";
import removeUnwantedCharacters from "modules/languageProcessing/removeUnwantedCharacters";
import _ from "underscore";
import { fileSafeTitle, formatUrl } from "ylhyra/server/content/links/paths";
import { deck } from "ylhyra/app/vocabulary/actions/deck";
import {
  HeaderData,
  readContentFile,
} from "ylhyra/documents/compile/functions/readContentFile";
import { getCardIdsFromWords } from "ylhyra/documents/compile/vocabulary/getCardIdsFromWords";
import { initializeDeckFromFile } from "ylhyra/documents/compile/vocabulary/initializeDeckFromFile";
import { content_folder } from "ylhyra/server/paths_backend";
import { FullFilePath, LinkData } from "ylhyra/server/content/links/types";

const links: { [key: string]: LinkData } = {};

/**
 * Generates `links.json` that maps URLs to files.
 * Run with:
 * > npm run links
 */
const run = () => {
  const files = getFilesRecursivelySync(content_folder);
  let vocabularyEntriesInArticles = [];

  if (!files || files.length === 0) {
    console.error("No files!!");
    process.exit();
  }

  for (const filepath of files) {
    if (typeof filepath !== "string") continue;
    let { header, body } = await readContentFile(filepath);
    if (!header) continue;
    const filename = fileSafeTitle(header.title); //+ '_' + string_hash(body)
    const url = formatUrl(header.url || header.title);
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
        if (links[formatUrl(r_title)]) return;
        // console.log({r_title})
        links[formatUrl(r_title)] = {
          redirect_to: url,
          section: r_section && formatUrl(r_section).replace(/^\//, ""),
        };
      });

    if (header.vocabulary) {
      vocabularyEntriesInArticles = vocabularyEntriesInArticles.concat(
        header.vocabulary
      );
    }
  }
  /* Write links */
  fs.writeFileSync("build/links.json", JSON.stringify(links, null, 2));

  if (!deck) initializeDeckFromFile();
  const missing_vocabulary_entries = vocabularyEntriesInArticles.filter(
    (sentence) => getCardIdsFromWords([sentence]).length === 0
  );
  fs.writeFileSync(
    "build/missing_vocabulary_entries.txt",
    _.uniq(missing_vocabulary_entries).join("\n")
  );
  process.exit();
};

export const shouldBeCreated = (filepath: FullFilePath, header: HeaderData) => {
  return (
    !/^(Data|File|Text|Template):/.test(header.title) &&
    !/\/(drafts?|test|newsletter)\//i.test(filepath) &&
    header.status !== "draft"
  );
};

export const shouldBeIndexed = (filepath: FullFilePath, header: HeaderData) => {
  return (
    shouldBeCreated(filepath, header) &&
    header.index !== "no" &&
    !filepath.includes("/project/")
  );
};

run();
