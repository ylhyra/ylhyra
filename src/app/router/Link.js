"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const log_1 = require("app/app/functions/log");
const time_1 = require("app/app/functions/time");
const load_1 = require("app/router/actions/load");
const updateURL_1 = require("app/router/actions/updateURL");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const start = (0, time_1.getTime)();
class Link extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.fn = (e, url) => {
            /* Do a full refresh if window is more than 10 minutes old */
            if ((0, time_1.getTime)() - start > 10 * time_1.minutes) {
                return;
            }
            if (e.altKey || e.metaKey || e.ctrlKey)
                return;
            e.preventDefault();
            (0, updateURL_1.updateURL)(url);
        };
    }
    render() {
        let { route, href, children, className, id } = this.props;
        if (!href) {
            console.warn("Missing href:");
            (0, log_1.log)(children);
            return "";
        }
        if (href.startsWith("//")) {
            console.error(`Typo in href found: "${href}" in route "${route}"`);
        }
        if (href.startsWith("https://ylhyra.is/")) {
            href = href.replace("https://ylhyra.is", "");
        }
        if (!href.startsWith("/") &&
            !/^[a-z]+:/.test(href) &&
            !href.startsWith("#")) {
            href = "/" + href;
        }
        if ((route.pathname === href && !href.includes("#")) || !href) {
            return ((0, jsx_runtime_1.jsx)("span", Object.assign({}, { className, id }, { children: (0, jsx_runtime_1.jsx)("b", { children: children }) })));
        }
        if (href.startsWith("/")) {
            return ((0, jsx_runtime_1.jsx)("a", Object.assign({ href: href }, { className, id }, { onClick: (e) => this.fn(e, href), onMouseEnter: () => (0, load_1.preload)(href) }, { children: children })));
        }
        return ((0, jsx_runtime_1.jsx)("a", Object.assign({ href: href }, { className, id }, { children: children })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    route: state.route,
}))(Link);
