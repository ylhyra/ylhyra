"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
class SignupSteps extends react_1.default.Component {
    componentDidMount() { }
    render() {
        if (!process.env.REACT_APP_PWYW)
            return null;
        const isSignup = this.props.route.pathname === "/signup";
        return ((0, jsx_runtime_1.jsx)("div", Object.assign({ id: "signup-steps", className: "pwyw-on" }, { children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("span", Object.assign({ className: isSignup ? "active" : "" }, { children: [!isSignup && "✓ ", (0, jsx_runtime_1.jsx)("b", { children: "Step 1" }), ": Create an account"] })), (0, jsx_runtime_1.jsxs)("span", Object.assign({ className: !isSignup ? "active" : "" }, { children: [(0, jsx_runtime_1.jsx)("b", { children: "Step 2" }), ": Pay what you want"] }))] }) })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    user: state.user,
    route: state.route,
}))(SignupSteps);
