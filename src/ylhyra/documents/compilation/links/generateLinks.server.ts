import fs from "fs";
import { getFilesRecursivelySync } from "modules/getFilesRecursivelySync";
import {
  HeaderData,
  readContentFile,
} from "ylhyra/documents/compilation/compileDocument/functions/readContentFile";
import { contentFolder } from "ylhyra/server/paths_directories";
import { FullFilePath, LinkData } from "ylhyra/documents/types";
import { formatUrl } from "ylhyra/documents/compilation/links/format/formatUrl";
import { fileSafeTitle } from "ylhyra/documents/compilation/links/format/fileSafeTitle";

const links: { [key: string]: Partial<LinkData> } = {};

/**
 * Generates `links.json` that maps URLs to files.
 * Run with:
 * > npm run links
 */
const run = async () => {
  const files = getFilesRecursivelySync(contentFolder);

  let allVocabularyEntriesUsedInArticles: HeaderData["vocabulary"] = [];

  if (!files || files.length === 0) {
    console.error("No files!!");
    process.exit();
  }

  for (const filepath of files) {
    if (typeof filepath !== "string") continue;
    let { header, body } = await readContentFile(filepath);
    if (!header /*|| !("url" in header)*/) continue;
    const filename = fileSafeTitle(header.title);
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

    /**
     * Process redirects
     */
    header.redirects &&
      header.redirects.forEach((redirect) => {
        if (!redirect) {
          console.log(filepath);
        }
        const [redirectTitle, redirectSection] = redirect.split("#");
        if (links[formatUrl(redirectTitle)]) return;
        links[formatUrl(redirectTitle)] = {
          redirect_to: url,
          section:
            redirectSection && formatUrl(redirectSection).replace(/^\//, ""),
        };
      });

    // /**
    //  * Housekeeping:
    //  * Keep track of which vocabulary entries are listed in articles,
    //  * so that we can fill in the missing ones.
    //  * Not used in content.
    //  */
    // if (header.vocabulary) {
    //   allVocabularyEntriesUsedInArticles =
    //     allVocabularyEntriesUsedInArticles.concat(header.vocabulary);
    // }
  }
  /* Write links */
  fs.writeFileSync("build/links.json", JSON.stringify(links, null, 2));

  // /* Keep track of missing vocabulary entries */
  // if (!deck) initializeDeckFromFile();
  // const missingVocabularyEntries = allVocabularyEntriesUsedInArticles.filter(
  //   (sentence) => getCardIdsFromWords([sentence]).length === 0
  // );
  // fs.writeFileSync(
  //   "build/missingVocabularyEntries.txt",
  //   _.uniq(missingVocabularyEntries).join("\n")
  // );

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
