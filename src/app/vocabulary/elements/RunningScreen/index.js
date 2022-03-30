"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const log_1 = require("app/app/functions/log");
const store_1 = __importDefault(require("app/app/store"));
const updateURL_1 = require("app/router/actions/updateURL");
const card_data_1 = require("app/vocabulary/actions/card/card_data");
const userLevel_1 = require("app/vocabulary/actions/userLevel");
const CardElement_1 = __importDefault(require("app/vocabulary/elements/RunningScreen/CardElement"));
const Progress_1 = __importDefault(require("app/vocabulary/elements/RunningScreen/Progress"));
const UserLevelScreen_1 = __importDefault(require("app/vocabulary/elements/UserLevelScreen"));
const react_1 = require("react");
const react_redux_1 = require("react-redux");
class RunningScreen extends react_1.Component {
    constructor() {
        super(...arguments);
        this.componentDidMount = () => {
            this.componentDidUpdate();
            window.addEventListener("keydown", this.checkKey);
        };
        this.componentDidUpdate = () => {
            const { deck } = this.props.vocabulary;
            if (!deck.session.currentCard) {
                (0, log_1.log)("No current cardInSession when GameContainer was loaded, initializing");
                deck.session.InitializeSession(); //tmp!
            }
        };
        this.checkKey = (e) => {
            var _a, _b;
            (_b = (_a = this.props.vocabulary.deck) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.checkForUndoOnKeyDown(e);
        };
    }
    componentWillUnmount() {
        window.removeEventListener("keydown", this.checkKey);
    }
    render() {
        var _a;
        if (!(0, userLevel_1.getUserLevel)()) {
            return (0, jsx_runtime_1.jsx)(UserLevelScreen_1.default, {});
        }
        const session = (_a = this.props.vocabulary.deck) === null || _a === void 0 ? void 0 : _a.session;
        if (!session)
            return null;
        const { card } = this.props.vocabulary;
        if (!card)
            return null;
        return ((0, jsx_runtime_1.jsx)("div", Object.assign({ id: "vocabulary-screen" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "vocabulary-screen-inner" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "vocabulary-header" }, { children: [(0, jsx_runtime_1.jsx)("button", Object.assign({ className: "link", onClick: () => session === null || session === void 0 ? void 0 : session.sessionDone() }, { children: "Quit" })), (0, jsx_runtime_1.jsx)("div", { children: "\u00A0\u00A0\u2022\u00A0\u00A0" }), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "link", onClick: () => {
                                    (0, updateURL_1.updateURL)("/vocabulary/tutorial", {
                                        dontChangeUrl: true,
                                    });
                                } }, { children: "Tutorial" })), session.undoable() && [
                                (0, jsx_runtime_1.jsx)("div", { children: "\u00A0\u00A0\u2022\u00A0\u00A0" }, 1),
                                (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "link", onClick: () => {
                                        session.undo();
                                    } }, { children: "Undo" }), 2),
                            ], (0, jsx_runtime_1.jsx)("div", { className: "spacer" }), (session === null || session === void 0 ? void 0 : session.cards.some((j) => (0, card_data_1.getSound)(j.getId()))) && ((0, jsx_runtime_1.jsxs)("button", Object.assign({ className: "link", onClick: () => {
                                    store_1.default.dispatch({ type: "VOCABULARY_AUDIO_ONOFF" });
                                } }, { children: ["Audio: ", (0, jsx_runtime_1.jsx)("b", { children: this.props.vocabulary.volume ? "On" : "Off" })] })))] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "game-container" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "vocabulary-card-outer-container" }, { children: (0, jsx_runtime_1.jsx)(CardElement_1.default, {}, card.counter) })), (0, jsx_runtime_1.jsx)(Progress_1.default, {})] }))] })) })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    vocabulary: state.vocabulary,
}))(RunningScreen);
