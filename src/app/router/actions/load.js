"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.preload = exports.loadContent = exports.abortAllThatAreNot = void 0;
const analytics_1 = __importDefault(require("app/app/analytics"));
const axios_1 = __importDefault(require("app/app/axios"));
const constants_1 = require("app/app/constants");
const isDev_1 = require("app/app/functions/isDev");
const store_1 = __importDefault(require("app/app/store"));
const actions_1 = require("app/router/actions");
const updateURL_1 = require("app/router/actions/updateURL");
const appUrls_1 = require("app/router/appUrls");
const ReadAlong_1 = require("documents/render/audio/ReadAlong");
const CLIENT_SIDE_RENDERING_IN_DEVELOPMENT_MODE = true && isDev_1.isDev;
let cache = {};
let expectedUrl = false;
const abortAllThatAreNot = (url) => {
    expectedUrl = url;
};
exports.abortAllThatAreNot = abortAllThatAreNot;
const loadContent = ({ url, prerender_data, preload, section, isInitializing, callback, }) => {
    if (url in appUrls_1.app_urls) {
        return;
    }
    /* Pre-rendered */
    if (prerender_data) {
        cache[url] = prerender_data;
    }
    if (url in cache) {
        set({ url, data: cache[url], preload, section, isInitializing, callback });
    }
    else {
        if (!preload) {
            expectedUrl = url;
        }
        axios_1.default
            .get("/api/content", {
            params: Object.assign({ title: decodeURI(url.replace(/#.+/, "")) || "/" }, (CLIENT_SIDE_RENDERING_IN_DEVELOPMENT_MODE
                ? {
                    clientSideRendering: true,
                }
                : {})),
        })
            .then(({ data }) => __awaiter(void 0, void 0, void 0, function* () {
            cache[url] = data;
            if (expectedUrl === url) {
                set({ url, data, preload, section, isInitializing, callback });
            }
        }))
            .catch((error) => {
            var _a;
            if (preload)
                return;
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                store_1.default.dispatch({
                    type: "LOAD_ROUTE_CONTENT",
                    data: "404",
                });
            }
        });
    }
};
exports.loadContent = loadContent;
const set = ({ url, data, preload, section, isInitializing, callback, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    analytics_1.default.startReadingPage(url);
    if (preload)
        return;
    let parsed, flattenedData;
    if ("parsed" in data) {
        parsed = data.parsed;
        flattenedData = data.flattenedData;
    }
    else if (CLIENT_SIDE_RENDERING_IN_DEVELOPMENT_MODE && isDev_1.isDev) {
        /* Only allowed in development mode */
        const Parse = (yield Promise.resolve().then(() => __importStar(require(
        /* webpackChunkName: "parse" */
        "../../../documents/parse")))).default;
        const out = Parse({
            html: data.content,
        });
        parsed = out.parsed;
        flattenedData = out.flattenedData;
        // console.log(out);
        /* Only used for the editor */
        store_1.default.dispatch({
            type: "INITIALIZE_WITH_TOKENIZED_AND_DATA",
            currentDocument: (_a = out.tokenized) === null || _a === void 0 ? void 0 : _a[data.header.title],
            allDocuments: out.tokenized,
            data: flattenedData,
            currentDocumentData: (_b = out.data) === null || _b === void 0 ? void 0 : _b[data.header.title],
            parsed: parsed,
        });
        // if(isBrowser){
        // window.currentDocumentTitle= data.header.title,
        // }
    }
    else {
        console.log({ data });
        console.error("No parsed in data!");
    }
    (0, actions_1.index)(data.shouldBeIndexed);
    // store.dispatch({
    //   type: "LOAD_ROUTE_CONTENT",
    //   data: {
    //     parsed,
    //     header: data.header,
    //   },
    // });
    url = data.redirect_to || url;
    if (url === "/" && (0, actions_1.isVocabularyTheFrontpage)()) {
        url = "/frontpage";
    }
    // console.log({ t: data.title });
    callback === null || callback === void 0 ? void 0 : callback();
    (0, updateURL_1.updateURL)(url + (section ? "#" + section : ""), {
        title: data.title,
        isLoadingContent: true,
        isInitializing,
        routeContent: {
            parsed,
            header: data.header,
        },
    });
    (0, ReadAlong_1.ReadAlongSetup)(flattenedData);
});
const preload = (url) => {
    if (!constants_1.PRELOAD_ARTICLES_ON_HOVER)
        return;
    (0, exports.loadContent)({ url, preload: true });
};
exports.preload = preload;
