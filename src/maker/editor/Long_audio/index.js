"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
// import Upload from './Upload'
const actions_1 = __importDefault(require("maker/editor/Long_audio/actions"));
const Synchronize_1 = require("maker/editor/Long_audio/Synchronize");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
class LongAudio extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.componentDidMount = () => {
            (0, actions_1.default)();
        };
    }
    render() {
        const { long_audio } = this.props;
        return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "xcenter" }, { children: Object.keys(long_audio).map((filename) => ((0, jsx_runtime_1.jsxs)("div", { children: [filename, " \u00A0", long_audio[filename].sync ? ("Synced!") : ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: () => (0, Synchronize_1.synchronize)(filename) }, { children: "Synchronize" })), " ", "(can take some time, please be patient after clicking)"] }))] }, filename))) })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    long_audio: state.editor.long_audio,
}))(LongAudio);
