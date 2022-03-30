"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = exports.getFrontpageURL = exports.isVocabularyTheFrontpage = exports.InitializeRouter = void 0;
const isBrowser_1 = require("app/app/functions/isBrowser");
const updateURL_1 = require("app/router/actions/updateURL");
const actions_1 = require("app/user/actions");
if (isBrowser_1.isBrowser) {
    window["HAS_LOADED"] = false;
    window.addEventListener("popstate", () => {
        if (window["HAS_LOADED"]) {
            void (0, updateURL_1.updateURL)(window.location.pathname + window.location.hash);
        }
    });
}
const InitializeRouter = (prerender_data) => {
    const { is404 } = window["is404"];
    void (0, updateURL_1.updateURL)(((prerender_data === null || prerender_data === void 0 ? void 0 : prerender_data.url) || window.location.pathname) + window.location.hash, {
        prerender_data,
        is404,
        isInitializing: true,
    });
};
exports.InitializeRouter = InitializeRouter;
const isVocabularyTheFrontpage = () => {
    return (0, actions_1.isUserLoggedIn)() || (0, actions_1.existsSchedule)();
};
exports.isVocabularyTheFrontpage = isVocabularyTheFrontpage;
const getFrontpageURL = () => {
    return (0, exports.isVocabularyTheFrontpage)() ? "/frontpage" : "/";
};
exports.getFrontpageURL = getFrontpageURL;
// export const getURL = () => {
//   return decodeURI(window.location.pathname).replace(/^\//, "");
// };
let isIndexed;
const index = (shouldIndex) => {
    if (!isBrowser_1.isBrowser)
        return;
    if (isIndexed !== Boolean(shouldIndex)) {
        document
            .querySelector('meta[name="robots"]')
            .setAttribute("content", shouldIndex ? "index" : "noindex");
    }
    isIndexed = shouldIndex;
};
exports.index = index;
