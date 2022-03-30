"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ucfirst_link = exports.stripHTML = exports.removeLinks = void 0;
const ucfirst_1 = require("app/app/functions/ucfirst");
const paths_1 = require("app/app/paths");
const classification_1 = require("inflection/tables/classification/classification");
/*
  Creates a link from our labels to relevant Ylhýra pages
*/
exports.default = (link, label) => {
    if (!link || typeof link !== "string")
        return "";
    if (label === undefined) {
        label = link;
    }
    else if (!label) {
        return "";
    }
    /* Retrieve additional info from "classification.js" file */
    const info = (0, classification_1.getTagInfo)(link, false);
    if (info) {
        if (info.has_article_on_ylhyra) {
            link = info.title;
        }
        else {
            /* Link does not exist */
            return label;
        }
    }
    /* Link does not exist */
    if (missing_links.includes(link)) {
        return label;
    }
    const url = "https://ylhyra.is" + encodeURI((0, paths_1.URL_title)(link));
    return `<a class="plainlink" target="_blank" href="${url}">${label}</a>`;
};
const removeLinks = (string) => {
    return string === null || string === void 0 ? void 0 : string.replace(/<\/a>/g, "").replace(/<a .+?>/g, "");
};
exports.removeLinks = removeLinks;
const stripHTML = (string) => {
    return (string &&
        string
            .replace(/<\/[a-z]+>/g, "")
            .replace(/<[a-z]+ ?([^>]+)?>/g, "")
            .replace(/\s+/g, " ")
            .trim());
};
exports.stripHTML = stripHTML;
const ucfirst_link = (input) => input.replace(/^(?:<a .+?>)?(.)/, (part) => {
    let split = part.split("");
    split[split.length - 1] = (0, ucfirst_1.ucfirst)(split[split.length - 1]);
    return split.join("");
});
exports.ucfirst_link = ucfirst_link;
let missing_links = [
    "irregular inflection",
    "includes a sound change",
    "regular inflection",
    "strongly conjugated",
    "weakly conjugated",
    "helper words for the article",
];
