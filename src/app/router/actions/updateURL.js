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
exports.updateURL = void 0;
const analytics_1 = __importDefault(require("app/app/analytics"));
const isBrowser_1 = require("app/app/functions/isBrowser");
const paths_1 = require("app/app/paths");
const store_1 = __importDefault(require("app/app/store"));
const index_1 = require("app/router/actions/index");
const load_1 = require("app/router/actions/load");
const appUrls_1 = require("app/router/appUrls");
const ReadAlong_1 = require("documents/render/audio/ReadAlong");
const renderTitle_1 = require("server/content/renderTitle");
function updateURL(url, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let { title, isLoadingContent, prerender_data, is404, dontChangeUrl, isInitializing, routeContent, } = options;
        if (isBrowser_1.isBrowser) {
            window.HAS_LOADED = true;
        }
        url = (0, paths_1.URL_title)(url);
        const [pathname, section] = url.split("#");
        if (!isInitializing && pathname === store_1.default.getState().route.pathname) {
            if (section) {
                scrollToId(section);
            }
            return;
        }
        const isComponent = pathname in appUrls_1.app_urls;
        if (isComponent) {
            analytics_1.default.stopReadingPage();
        }
        if (url === "/") {
            url = (0, index_1.getFrontpageURL)();
        }
        if (!url.startsWith("/")) {
            url = "/" + url;
        }
        url = decodeURI(url);
        (0, load_1.abortAllThatAreNot)(url);
        if (!title && isComponent) {
            title = appUrls_1.app_urls[pathname].title;
        }
        if (title || isLoadingContent || isComponent) {
            window.document.title = (0, renderTitle_1.renderTitle)(title);
        }
        /*
          Force vocabulary game to keep the URL of the article it is started on
        */
        if (url === "/vocabulary/play") {
            store_1.default.dispatch({
                type: "ROUTE",
                content: {
                    pathname: url,
                },
            });
            window.history.pushState(null, "", window.location.pathname);
            return;
        }
        if (is404) {
            store_1.default.dispatch({
                type: "LOAD_ROUTE_CONTENT",
                data: "404",
            });
            return;
        }
        // console.log({ url, options });
        if (!dontChangeUrl &&
            (encodeURI(url) !== window.location.pathname ||
                // Check if has parameters
                (isInitializing && window.location.search))) {
            if (isInitializing) {
                window.history.replaceState(null, "", encodeURI(url));
            }
            else if (isLoadingContent || isComponent) {
                window.history.pushState(null, "", encodeURI(url));
            }
        }
        // console.log({
        //   replace,
        //   isComponent,
        // });
        if (!isLoadingContent && !isComponent) {
            (0, load_1.loadContent)({
                url: pathname,
                prerender_data,
                section,
                isInitializing,
            });
        }
        if ((!prerender_data && isLoadingContent) || isComponent) {
            (0, ReadAlong_1.clear)();
            store_1.default.dispatch({
                type: "ROUTE",
                content: {
                    pathname: pathname,
                    section: section,
                    data: routeContent,
                },
            });
            if (!section) {
                window.scrollTo(0, 0);
            }
            else {
                scrollToId(section);
            }
        }
    });
}
exports.updateURL = updateURL;
const scrollToId = (id) => {
    window.history.scrollRestoration = "manual";
    const el = document.getElementById(id);
    el === null || el === void 0 ? void 0 : el.scrollIntoView();
};
