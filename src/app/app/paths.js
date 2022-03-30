"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSafeTitle = exports.section_id = exports.URL_title = exports.get_processed_image_url = exports.getDynamicFileUrl = exports.unprocessed_image_url = exports.processed_image_url = exports.contentUrl = void 0;
exports.contentUrl = "/api/content";
exports.processed_image_url = `/api/images`;
exports.unprocessed_image_url = `/api/images2`;
/* File URLs */
const getDynamicFileUrl = (file) => `/api/content?title=file/${encodeURIComponent(file.trim())}`;
exports.getDynamicFileUrl = getDynamicFileUrl;
const get_processed_image_url = (file, audio) => `${exports.processed_image_url}/${audio ? "audio/" : ""}${encodeURIComponent(file.trim())}`;
exports.get_processed_image_url = get_processed_image_url;
/* URL slugs */
const URL_title = (title) => {
    if (!title)
        return "/";
    let [path, section] = title.split("#");
    path = path
        .toLowerCase()
        .trim()
        .replace(/([_ –—])/g, "-")
        .replace(/[(),!?;]/g, "")
        .replace(/-+/g, "-")
        .replace(/:/g, "/")
        .replace(/[/]+/g, "/")
        .replace(/^\//g, "")
        .replace(/\/$/g, "");
    path = "/" + path;
    section = (0, exports.section_id)(section);
    return path + (section ? "#" + section : "");
};
exports.URL_title = URL_title;
const prefix = "section-";
const section_id = (title) => {
    if (!title || title.startsWith(prefix))
        return title;
    return (prefix +
        encodeURIComponent((0, exports.URL_title)(title).replace(/^\//, ""))
            .replace(/%/g, "_")
            .replace(/([^a-z0-9_])/g, "_"));
};
exports.section_id = section_id;
const FileSafeTitle = (title) => {
    return ((0, exports.URL_title)(title)
        .replace(/(\/)/g, "_")
        .replace(/(:)/g, "_")
        .replace(/^_/g, "")
        .replace(/_+/g, "_")
        .replace(/[()]/g, "") || "frontpage");
};
exports.FileSafeTitle = FileSafeTitle;
