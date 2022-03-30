"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const updateURL_1 = require("app/router/actions/updateURL");
const Link_1 = __importDefault(require("app/router/Link"));
const functions_1 = require("app/vocabulary/actions/functions");
const userLevel_1 = require("app/vocabulary/actions/userLevel");
const actions_1 = require("app/vocabulary/elements/OverviewScreen/actions");
const ActivityCalendar_1 = __importDefault(require("app/vocabulary/elements/OverviewScreen/ActivityCalendar"));
const Section_1 = __importDefault(require("documents/templates/Section"));
const Spacer_1 = __importDefault(require("documents/templates/Spacer"));
const react_1 = require("react");
const react_redux_1 = require("react-redux");
class Overview extends react_1.Component {
    componentDidMount() {
        this.componentDidUpdate();
    }
    componentDidUpdate() {
        if (!this.props.vocabulary.overview.loaded) {
            void (0, actions_1.calculateOverview)();
        }
    }
    render() {
        const { deck, session, overview } = this.props.vocabulary;
        const p = overview.percentage_known_overall || null;
        return [
            (0, jsx_runtime_1.jsxs)(Section_1.default, Object.assign({ className: "brown-background vocabulary-main-screen" }, { children: [(0, jsx_runtime_1.jsx)(Spacer_1.default, { space: "70" }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "centered-button" }, { children: [(0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: () => (0, updateURL_1.updateURL)("/vocabulary/play"), className: "button dark-blue big" }, { children: session ? "Continue" : "Start a study session" })), deck && p !== null && ((0, jsx_runtime_1.jsxs)("div", { children: [p, "% known out of ", deck.termCount, " terms"] }))] })), (0, jsx_runtime_1.jsx)(Spacer_1.default, { space: "70" }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ style: { display: "flex", alignItems: "center" } }, { children: [(0, jsx_runtime_1.jsx)(Link_1.default, Object.assign({ href: "/vocabulary/tutorial" }, { children: "Tutorial" })), (0, jsx_runtime_1.jsx)("div", { style: { flex: "1" } }), p !== null && p > 0.2 && ((0, jsx_runtime_1.jsx)("button", Object.assign({ className: "simple-button", onClick: () => (0, functions_1.studyNewTerms)() }, { children: "Show me new terms" })))] }))] }), 1),
            (0, jsx_runtime_1.jsxs)(Section_1.default, { children: [(0, jsx_runtime_1.jsx)(ActivityCalendar_1.default, {}), (0, jsx_runtime_1.jsx)(Spacer_1.default, { space: "50" }), (0, userLevel_1.getUserLevel)() && ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "simple-button gray-button", onClick: () => (0, updateURL_1.updateURL)("/vocabulary/difficulty") }, { children: "Change difficulty settings" })) }))] }, 2),
        ];
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    vocabulary: state.vocabulary,
}))(Overview);
