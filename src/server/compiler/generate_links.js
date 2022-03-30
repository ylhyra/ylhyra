"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldBeIndexed = exports.shouldBeCreated = void 0;
/*
npm run links
*/
const getFilesRecursivelySync_1 = require("app/app/functions/getFilesRecursivelySync");
const removeUnwantedCharacters_1 = __importDefault(require("app/app/functions/languageProcessing/removeUnwantedCharacters"));
const paths_1 = require("app/app/paths");
const deck_1 = require("app/vocabulary/actions/deck");
const ParseHeaderAndBody_1 = require("documents/compile/functions/ParseHeaderAndBody");
const getCardIdsFromWords_1 = require("documents/compile/vocabulary/getCardIdsFromWords");
const initializeDeckFromFile_1 = require("documents/compile/vocabulary/initializeDeckFromFile");
// import urlSlug from 'src/app/App/functions/url-slug'
const fs_1 = __importDefault(require("fs"));
const paths_backend_1 = require("server/paths_backend");
const underscore_1 = __importDefault(require("underscore"));
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
    const files = (0, getFilesRecursivelySync_1.getFilesRecursivelySync)(paths_backend_1.content_folder);
    let vocabulary_entries_in_articles = [];
    if (!files || files.length === 0) {
        console.error("No files!!");
        process.exit();
    }
    for (const filepath of files) {
        if (typeof filepath !== "string")
            continue;
        let data = fs_1.default.readFileSync(filepath, "utf8");
        data = (0, removeUnwantedCharacters_1.default)(data);
        let { header, body } = (0, ParseHeaderAndBody_1.ParseHeaderAndBody)(data);
        if (!header)
            continue;
        const filename = (0, paths_1.FileSafeTitle)(header.title); //+ '_' + string_hash(body)
        const url = (0, paths_1.URL_title)(header.url || header.title);
        if (url in links) {
            throw new Error(`"${header.title}" already exists`);
        }
        links[url] = {
            filepath,
            filename,
        };
        if ((0, exports.shouldBeCreated)(filepath, header)) {
            links[url] = Object.assign(Object.assign({}, links[url]), { shouldBeCreated: true, title: header.title });
        }
        if ((0, exports.shouldBeIndexed)(filepath, header)) {
            links[url].shouldBeIndexed = true;
        }
        header.redirects &&
            header.redirects.forEach((r) => {
                if (!r) {
                    console.log(filepath);
                }
                const [r_title, r_section] = r.split("#");
                if (links[(0, paths_1.URL_title)(r_title)])
                    return;
                // console.log({r_title})
                links[(0, paths_1.URL_title)(r_title)] = {
                    redirect_to: url,
                    section: r_section && (0, paths_1.URL_title)(r_section).replace(/^\//, ""),
                };
            });
        if (header.vocabulary) {
            vocabulary_entries_in_articles = vocabulary_entries_in_articles.concat(header.vocabulary);
        }
    }
    /* Write links */
    fs_1.default.writeFileSync("build/links.json", JSON.stringify(links, null, 2));
    if (!deck_1.deck)
        (0, initializeDeckFromFile_1.initializeDeckFromFile)();
    const missing_vocabulary_entries = vocabulary_entries_in_articles.filter((sentence) => (0, getCardIdsFromWords_1.getCardIdsFromWords)([sentence]).length === 0);
    fs_1.default.writeFileSync("build/missing_vocabulary_entries.txt", underscore_1.default.uniq(missing_vocabulary_entries).join("\n"));
    process.exit();
};
const shouldBeCreated = (filepath, header) => {
    return (!/^(Data|File|Text|Template):/.test(header.title) &&
        !/\/(drafts?|test|newsletter)\//i.test(filepath) &&
        header.status !== "draft");
};
exports.shouldBeCreated = shouldBeCreated;
const shouldBeIndexed = (filepath, header) => {
    return ((0, exports.shouldBeCreated)(filepath, header) &&
        header.index !== "no" &&
        !filepath.includes("/project/"));
};
exports.shouldBeIndexed = shouldBeIndexed;
run();
