"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Link_1 = __importDefault(require("app/router/Link"));
const actions_1 = require("app/user/actions");
const LoginButton_1 = __importDefault(require("app/user/LoginButton"));
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
class Layout extends react_1.default.Component {
    render() {
        const not_banner = ["/login", "/signup"].includes(this.props.route.pathname);
        let className = "";
        if (this.props.route.pathname === "/vocabulary") {
            className = "brown-background";
        }
        return ((0, jsx_runtime_1.jsxs)("header", Object.assign({ className: className }, { children: [!(0, actions_1.isUserLoggedIn)() && (0, actions_1.existsSchedule)() && !not_banner && ((0, jsx_runtime_1.jsx)(Link_1.default, Object.assign({ href: "/signup", className: "notification please-log-in" }, { children: "Create an account to save your progress" }))), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "header-container" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "header-container-inner" }, { children: [(0, jsx_runtime_1.jsx)(Link_1.default, { href: "/", id: "logo" }), (0, jsx_runtime_1.jsx)(Navlinks, {}), (0, jsx_runtime_1.jsx)(LoginButton_1.default, {})] })) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "header-container-below hidden", hidden: true }, { children: (0, jsx_runtime_1.jsx)(Navlinks, {}) }))] })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    route: state.route,
    vocabulary: state.vocabulary,
}))(Layout);
const Navlinks = () => ((0, jsx_runtime_1.jsx)("nav", Object.assign({ className: "navlinks" }, { children: (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(Link_1.default, Object.assign({ href: "/vocabulary" }, { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ className: "large" }, { children: "Vocabulary" })), (0, jsx_runtime_1.jsx)("span", Object.assign({ className: "medium" }, { children: "Vocab." }))] })) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(Link_1.default, Object.assign({ href: "/course" }, { children: "Course" })) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(Link_1.default, Object.assign({ href: "/texts" }, { children: "Texts" })) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(Link_1.default, Object.assign({ href: "/explanations" }, { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ className: "large" }, { children: "Explanations" })), (0, jsx_runtime_1.jsx)("span", Object.assign({ className: "medium" }, { children: "Expl." }))] })) })] }) })));
