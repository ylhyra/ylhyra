"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessLinks = void 0;
const paths_1 = require("app/app/paths");
const appUrls_1 = require("app/router/appUrls");
const links_1 = require("server/content/links");
const ProcessLinks = (input
// links /* Links passed specifically so that this can be used in the frontend */
) => {
    return (input
        /* Internal links */
        .replace(/\[\[(.+?)\]\]([a-záéíúóðþýöæ]+)?/gi, (x, match, after) => {
        let [link, text] = match.split("|");
        link = link.trim();
        text = (text || link).trim() + (after || "");
        if (/^:?w:/i.test(link)) {
            link = `https://en.wikipedia.org/wiki/${encodeURIComponent(link.replace(/^w:/i, ""))}`;
            return `<a href="${link}">${text}</a>`;
        }
        else {
            link = (0, paths_1.URL_title)(link);
            const [input_url, input_section] = link.split("#");
            let values = (0, links_1.getValuesForURL)(input_url);
            // if (values.url === "/g") {
            //   console.log(values);
            // }
            if (!(input_url in appUrls_1.app_urls) && !(values === null || values === void 0 ? void 0 : values.shouldBeCreated)) {
                return text;
            }
            let url = encodeURI(values.url || input_url /*For appurls*/);
            let section = values.section || input_section;
            if (section) {
                url += "#" + encodeURI(section);
            }
            return `<a href="${url}">${text}</a>`;
        }
    })
        /* Bare external links */
        .replace(/\[((?:http|mailto)[^ ]+?)\]/g, (x, url) => {
        return `&#91;<a href="${url}">link</a>&#93;`;
    })
        /* External links */
        .replace(/\[((?:http|mailto)[^ ]+?) (.+?)\]/g, (x, url, text) => {
        return `<a href="${url}">${text}</a>`;
    }));
};
exports.ProcessLinks = ProcessLinks;
