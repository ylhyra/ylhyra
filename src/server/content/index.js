"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = __importDefault(require("app/app/functions/hash"));
const isDev_1 = require("app/app/functions/isDev");
const compile_1 = __importDefault(require("documents/compile"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const caching_1 = require("server/caching");
const links_1 = require("server/content/links");
const paths_backend_1 = require("server/paths_backend");
const router = require("express").Router({ strict: true });
router.get(["/robots.txt"], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.subdomains.includes("test")) {
        res.send("User-agent: *\nDisallow: /");
    }
    else {
        res.sendFile(path_1.default.join(__basedir, "./src/app/app/public/robots.txt"));
    }
}));
router.get(["/api/content", "*"], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let input_url;
    let type = "html";
    if ("title" in req.query) {
        input_url = req.query.title;
        type = "json";
    }
    else {
        input_url = decodeURI(req.path);
    }
    let values = (0, links_1.getValuesForURL)(input_url);
    let redirect_to;
    if (values.url &&
        input_url.replaceAll("/", "") !== values.url.replaceAll("/", "")) {
        redirect_to = values.url;
    }
    /* Turn off indexing for testing site */
    if (req.subdomains.includes("test")) {
        res.set("X-Robots-Tag", "noindex,nofollow");
    }
    else if (values === null || values === void 0 ? void 0 : values.shouldBeIndexed) {
        res.set("X-Robots-Tag", "index,noimageindex");
    }
    else {
        res.set("X-Robots-Tag", "noindex");
    }
    (0, caching_1.cacheControl)(res, "html");
    if (values === null || values === void 0 ? void 0 : values.filename) {
        let { title, filepath, filename, url } = values;
        if (url.startsWith("/file/")) {
            (0, caching_1.cacheControl)(res, "immutable");
            res.sendFile(filepath.replace(/(\.[a-z]+)$/i, "") // Fjarlægir ".md"
            );
        }
        else {
            /* Client side rendering allowed in development */
            if (req.query.clientSideRendering &&
                isDev_1.isDev &&
                type === "json" &&
                values.filepath) {
                const { content, header } = yield (0, compile_1.default)(url);
                if ("html" in req.query) {
                    return res.send(content);
                }
                res.send(Object.assign(Object.assign({}, values), { redirect_to,
                    content,
                    title,
                    header }));
                `+`;
            }
            // else if (redirect_to && type === "html" && input_url !== "/frontpage") {
            //   res.redirect(301, encodeURI(redirect_to));
            // }
            else {
                fs_1.default.readFile(path_1.default.resolve(paths_backend_1.build_folder, `./prerender/${filename}.${type}`), "utf8", (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                    // Last-Modified:
                    // console.log(err);
                    if (err) {
                        send404html(res);
                    }
                    else {
                        if (type === "html") {
                            data = addBuildIds(data);
                        }
                        return res.send(data);
                    }
                }));
            }
        }
    }
    else {
        if (type === "json") {
            return res.sendStatus(404);
        }
        else {
            send404html(res);
        }
    }
}));
const send404html = (res) => {
    fs_1.default.readFile(path_1.default.resolve(paths_backend_1.build_folder, `./prerender/not-found.html`), "utf8", (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        return res.status(404).send(addBuildIds(data));
    }));
};
exports.default = router;
const fileHash = (file) => {
    try {
        return (0, hash_1.default)(fs_1.default.readFileSync(file, "utf8"));
    }
    catch (e) {
        return "";
    }
};
const css_hash = fileHash(path_1.default.resolve(paths_backend_1.build_folder, `./app/main.css`));
const js_hash = fileHash(path_1.default.resolve(paths_backend_1.build_folder, `./app/ylhyra.main.js`));
const voc_hash = fileHash(path_1.default.resolve(paths_backend_1.build_folder, `./vocabulary/vocabulary_database.json`));
const addBuildIds = (data) => {
    return data
        .replace('ylhyra.main.js"', `ylhyra.main.js?v=${js_hash}"`)
        .replace('app/main.css"', `app/main.css?v=${css_hash}"`)
        .replace('meta name="vocabulary_id" content=""', `meta name="vocabulary_id" content="${voc_hash}"`);
};
