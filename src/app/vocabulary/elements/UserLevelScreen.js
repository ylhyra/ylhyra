"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const deck_1 = require("app/vocabulary/actions/deck");
const functions_1 = require("app/vocabulary/actions/functions");
const userLevel_1 = require("app/vocabulary/actions/userLevel");
const constants_1 = require("app/vocabulary/constants");
const react_1 = require("react");
const react_redux_1 = require("react-redux");
class X extends react_1.Component {
    set(level) {
        (0, userLevel_1.setUserLevel)(level);
        if (this.props.route.pathname === "/vocabulary/difficulty") {
            (0, functions_1.exitVocabularyScreen)();
        }
    }
    render() {
        if (!deck_1.deck)
            return null;
        const userLevel = (0, userLevel_1.getUserLevel)();
        return ((0, jsx_runtime_1.jsx)("div", Object.assign({ id: "vocabulary-screen", className: "select-level-screen" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "vocabulary-screen-inner" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ id: "vocabulary-header" }, { children: (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "link", onClick: functions_1.exitVocabularyScreen }, { children: "Back" })) })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "game-container" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "select-level-screen-header" }, { children: ["What is your current ", (0, jsx_runtime_1.jsx)("br", {}), "level in Icelandic?"] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "select-level-buttons" }, { children: [(0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: () => this.set(constants_1.USER_LEVEL_BEGINNER), className: userLevel <= constants_1.USER_LEVEL_BEGINNER ? "green" : "gray" }, { children: (0, jsx_runtime_1.jsxs)("h3", { children: ["Beginner ", (0, jsx_runtime_1.jsx)("span", { children: "(A0)" })] }) })), (0, jsx_runtime_1.jsxs)("button", Object.assign({ onClick: () => this.set(constants_1.USER_LEVEL_NOVICE), className: (0, userLevel_1.getUserLevel)() === constants_1.USER_LEVEL_NOVICE ? "green" : "gray" }, { children: [(0, jsx_runtime_1.jsxs)("h3", { children: ["Novice ", (0, jsx_runtime_1.jsx)("span", { children: "(A1-A2)" })] }), (0, jsx_runtime_1.jsx)("div", { children: "I can write simple sentences" })] })), (0, jsx_runtime_1.jsxs)("button", Object.assign({ onClick: () => this.set(constants_1.USER_LEVEL_INTERMEDIATE), className: (0, userLevel_1.getUserLevel)() === constants_1.USER_LEVEL_INTERMEDIATE ? "green" : "gray" }, { children: [(0, jsx_runtime_1.jsxs)("h3", { children: ["Intermediate ", (0, jsx_runtime_1.jsx)("span", { children: "(B1-B2)" })] }), (0, jsx_runtime_1.jsxs)("div", { children: ["I can easily hold a conversation ", (0, jsx_runtime_1.jsx)("br", {}), "and I know most inflection tables"] })] })), (0, jsx_runtime_1.jsxs)("button", Object.assign({ onClick: () => this.set(constants_1.USER_LEVEL_ADVANCED), className: (0, userLevel_1.getUserLevel)() === constants_1.USER_LEVEL_ADVANCED ? "green" : "gray" }, { children: [(0, jsx_runtime_1.jsxs)("h3", { children: ["Advanced ", (0, jsx_runtime_1.jsx)("span", { children: "(B2+)" })] }), (0, jsx_runtime_1.jsx)("div", { children: "I can write nearly error-free text" })] }))] })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "smaller gray center" }, { children: "(You can change this setting later)" }))] }))] })) })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    route: state.route,
    vocabulary: state.vocabulary,
}))(X);
