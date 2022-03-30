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
const jsx_runtime_1 = require("react/jsx-runtime");
const isBrowser_1 = require("app/app/functions/isBrowser");
const isDev_1 = require("app/app/functions/isDev");
const render_1 = __importDefault(require("documents/render"));
const _404_1 = __importDefault(require("documents/templates/404"));
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const RenderEditor = react_1.default.lazy(() => Promise.resolve().then(() => __importStar(require("maker/editor"))));
/**
 * Renders data loaded from server
 */
class Content extends react_1.Component {
    render() {
        var _a;
        if (this.props.route.data === "404")
            return (0, jsx_runtime_1.jsx)(_404_1.default, {});
        const parsed = ((_a = this.props.route.data) === null || _a === void 0 ? void 0 : _a.parsed) || this.props.prerender;
        if (!parsed)
            return (0, jsx_runtime_1.jsx)(Loading, {}, this.props.route.pathname);
        // import(
        //   /* webpackChunkName: "editor" */
        //   "./maker/editor/index.js"
        //   );
        if (isDev_1.isDev && isBrowser_1.isBrowser) {
            return [
                (0, render_1.default)({ json: parsed }),
                (0, jsx_runtime_1.jsx)(react_1.Suspense, Object.assign({ fallback: "" }, { children: (0, jsx_runtime_1.jsx)(RenderEditor, {}) }), 2),
            ];
        }
        else {
            return (0, render_1.default)({ json: parsed });
        }
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    route: state.route,
}))(Content);
class Loading extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    componentDidMount() {
        this.timer = setTimeout(() => {
            this.setState({ failed: true });
        }, 2000);
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    render() {
        if (this.state.failed)
            return (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "small gray center" }, { children: "Loading failed" }));
        return (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "small gray center" }, { children: "Loading..." }));
    }
}
