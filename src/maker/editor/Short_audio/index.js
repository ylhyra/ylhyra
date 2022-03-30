"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const actions_1 = require("maker/editor/Short_audio/actions");
const Recorder_1 = __importDefault(require("maker/editor/Short_audio/Recorder"));
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
class Sounds extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.componentDidMount = () => {
            this.load();
        };
        this.load = () => {
            if (!this.props.short_audio.areSoundsUpdated) {
                (0, actions_1.findSoundBites)();
            }
        };
    }
    componentDidUpdate() {
        this.load();
    }
    render() {
        const { short_audio } = this.props;
        return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "center" }, { children: (0, jsx_runtime_1.jsx)("table", Object.assign({ className: "wikitable" }, { children: (0, jsx_runtime_1.jsx)("tbody", { children: short_audio.soundList &&
                        short_audio.soundList.map((sound, index) => {
                            var _a;
                            return ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { children: sound }), (0, jsx_runtime_1.jsx)("td", { children: (_a = short_audio.sounds[sound]) === null || _a === void 0 ? void 0 : _a.map((file, index2) => ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("audio", { src: file, controls: true }) }, index2))) }), (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)(Recorder_1.default, { word: sound }) })] }, index));
                        }) }) })) })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    short_audio: state.editor.short_audio,
    editor: state.editor,
}))(Sounds);
