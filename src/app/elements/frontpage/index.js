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
const demo_1 = __importStar(require("app/elements/frontpage/demo"));
const Link_1 = __importDefault(require("app/router/Link"));
const actions_1 = require("app/user/actions");
const percentageKnown_1 = require("app/vocabulary/actions/functions/percentageKnown");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
class Screen extends react_1.default.Component {
    componentDidMount() {
        (0, demo_1.default)();
    }
    componentWillUnmount() {
        (0, demo_1.turnOffDemonstration)();
    }
    render() {
        return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "frontpage-button" }, { children: !((0, actions_1.isUserLoggedIn)() || (0, actions_1.existsSchedule)()) ? ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(Link_1.default, Object.assign({ href: "/vocabulary/play", className: "button dark-blue big" }, { children: "Start learning" })) }), (0, jsx_runtime_1.jsx)(Link_1.default, Object.assign({ href: "/login", className: "below-button" }, { children: "Already have an account?" }))] })) : ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Link_1.default, Object.assign({ href: "/vocabulary/play", className: "button dark-blue big" }, { children: "Start session" })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "below-button" }, { children: [(0, percentageKnown_1.PercentageKnownOverall)(), "% known overall"] }))] }) })) })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    vocabulary: state.vocabulary,
    user: state.user,
}))(Screen);
