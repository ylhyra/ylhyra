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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app_urls = void 0;
const isBrowser_1 = require("app/app/functions/isBrowser");
const isDev_1 = require("app/app/functions/isDev");
const Login_1 = __importDefault(require("app/user/screens/Login"));
const Settings_1 = __importDefault(require("app/user/screens/Settings"));
const OverviewScreen_1 = __importDefault(require("app/vocabulary/elements/OverviewScreen"));
const RunningScreen_1 = __importDefault(require("app/vocabulary/elements/RunningScreen"));
const UserLevelScreen_1 = __importDefault(require("app/vocabulary/elements/UserLevelScreen"));
const _404_1 = __importDefault(require("documents/templates/404"));
const react_1 = __importDefault(require("react"));
exports.app_urls = {
    "/vocabulary": {
        title: "Vocabulary",
        component: OverviewScreen_1.default,
    },
    "/vocabulary/play": {
        title: "Vocabulary",
        component: RunningScreen_1.default,
    },
    "/vocabulary/difficulty": {
        title: "Difficulty",
        component: UserLevelScreen_1.default,
    },
    "/login": {
        title: "Log in",
        component: Login_1.default,
    },
    "/settings": {
        title: "Settings",
        component: Settings_1.default,
    },
    "/not-found": {
        component: _404_1.default,
    },
};
if (isDev_1.isDev && isBrowser_1.isBrowser) {
    exports.app_urls["/maker"] = {
        component: react_1.default.lazy(() => Promise.resolve().then(() => __importStar(require(
        /* webpackChunkName: "vocmak" */
        "../../maker/vocabulary_maker/Elements")))),
    };
    exports.app_urls["/maker/record"] = {
        component: react_1.default.lazy(() => Promise.resolve().then(() => __importStar(require(
        /* webpackChunkName: "vocmak" */
        "../../maker/vocabulary_maker/record")))),
    };
}
// const components = {};
// const url_to_info_ = {};
// for (const name of Object.keys(urls)) {
//   components[urls[name].url] = urls[name].component;
//   url_to_info_[urls[name].url] = { ...urls[name], name };
// }
// export const url_to_info = url_to_info_;
// export default components;
