"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValuesForURL = void 0;
const paths_1 = require("app/app/paths");
const appUrls_1 = require("app/router/appUrls");
const path_1 = __importDefault(require("path"));
const loadLinks_1 = require("server/content/loadLinks");
/**
 * Wrapper to be able to use in front and backend
 * @param {string} url
 * @returns {LinkDataWithUrl|{}}
 */
const getValuesForURL = (url) => {
    if (!url && url !== "")
        return {};
    url = (0, paths_1.URL_title)(url);
    let values = loadLinks_1.links[url];
    let section;
    if (values) {
        if ("redirect_to" in values) {
            url = values.redirect_to;
            section = values.section;
            values = loadLinks_1.links[values.redirect_to];
        }
        values.url = url;
        if (section) {
            values.section = section;
        }
        values.filepath = values.filepath.replace(/^.+ylhyra_content/, path_1.default.resolve(process.env.PWD || ".", "./../ylhyra_content"));
        return values;
    }
    else if (url in appUrls_1.app_urls) {
        return {
            title: "",
            filename: (0, paths_1.FileSafeTitle)(url),
            url,
        };
    }
    else {
        return {};
    }
};
exports.getValuesForURL = getValuesForURL;
