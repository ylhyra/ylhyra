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
const jsx_runtime_1 = require("react/jsx-runtime");
// import "core-js/stable";
const isBrowser_1 = require("app/app/functions/isBrowser");
const store_1 = __importDefault(require("app/app/store"));
const router_1 = __importDefault(require("app/router"));
const actions_1 = require("app/router/actions");
const actions_2 = require("app/user/actions");
const initialize_1 = require("app/vocabulary/actions/initialize");
const touch_1 = require("documents/read/touch");
// import "regenerator-runtime/runtime";
require("documents/style/main.styl");
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_redux_1 = require("react-redux");
let prerender_data;
if (isBrowser_1.isBrowser && "ylhyra_data" in window) {
    prerender_data = window.ylhyra_data;
    delete window.ylhyra_data;
}
(0, actions_1.InitializeRouter)(prerender_data);
(0, actions_2.InitializeUser)();
(0, initialize_1.InitializeVocabulary)();
(0, touch_1.TextEventListenersOn)();
const Root = ((0, jsx_runtime_1.jsx)(react_1.default.StrictMode, { children: (0, jsx_runtime_1.jsx)(react_redux_1.Provider, Object.assign({ store: store_1.default }, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, Object.assign({ fallback: (0, jsx_runtime_1.jsx)("div", { children: "Loading..." }) }, { children: (0, jsx_runtime_1.jsx)(router_1.default, {}) })) })) }));
if (prerender_data /*|| window.is404*/) {
    react_dom_1.default.hydrate(Root, document.getElementById("root"));
}
else {
    react_dom_1.default.render(Root, document.getElementById("root"));
}
/* Frontend testing */
window.testing = (only_run) => __awaiter(void 0, void 0, void 0, function* () {
    yield (yield Promise.resolve().then(() => __importStar(require(
    /* webpackChunkName: "test" */
    "tests/integrationTests")))).default(only_run);
});
