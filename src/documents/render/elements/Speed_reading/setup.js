"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeedReaderSetup = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const store_1 = __importDefault(require("app/app/store"));
const Speed_reading_1 = __importDefault(require("documents/render/elements/Speed_reading"));
const actions_1 = require("documents/render/elements/Speed_reading/actions/actions");
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_redux_1 = require("react-redux");
const SpeedReaderSetup = () => {
    /* Book not found */
    if (($(".book").length === 0 && store_1.default.getState().route.pathname === "Ylhýra") ||
        store_1.default.getState().route.pathname === "Text:Frontpage")
        return;
    if ($(".book").length !== 1)
        return;
    $("#catlinks").before('<div id="speed-reader-button-container"></div>');
    $("#container").after('<div id="speed-reader-container"></div>');
    react_dom_1.default.render((0, jsx_runtime_1.jsx)("button", Object.assign({ className: "small", onClick: actions_1.open }, { children: "Speed read" })), document.getElementById("speed-reader-button-container"));
    react_dom_1.default.render((0, jsx_runtime_1.jsx)(react_redux_1.Provider, Object.assign({ store: store_1.default }, { children: (0, jsx_runtime_1.jsx)(SpeedReaderContainer, {}) })), document.getElementById("speed-reader-container"));
};
exports.SpeedReaderSetup = SpeedReaderSetup;
exports.default = exports.SpeedReaderSetup;
class _SpeedReaderContainer extends react_1.default.Component {
    render() {
        if (this.props.speed_reader.open) {
            // window.listenerCount = 0 /* Turn off mousemove listener for text popups */
            return (0, jsx_runtime_1.jsx)(Speed_reading_1.default, {});
        }
        return null;
    }
}
const SpeedReaderContainer = (0, react_redux_1.connect)((state) => ({
    speed_reader: state.speed_reader,
}))(_SpeedReaderContainer);
