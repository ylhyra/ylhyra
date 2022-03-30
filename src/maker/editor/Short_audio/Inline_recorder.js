"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const store_1 = __importDefault(require("app/app/store"));
const Recorder_1 = __importDefault(require("maker/editor/Short_audio/Recorder"));
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_redux_1 = require("react-redux");
const RenderRecorder = () => {
    if (mw.util.getParamValue("action") !== "edit")
        return;
    $("#actions").append('<div id="recorder-button-container"></div>');
    react_dom_1.default.render((0, jsx_runtime_1.jsx)(react_redux_1.Provider, Object.assign({ store: store_1.default }, { children: (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(RecorderButton, {}) }) }) })), document.querySelector("#recorder-button-container"));
};
class RecorderButton extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            open: false,
        };
    }
    render() {
        if (!this.state.open) {
            return ((0, jsx_runtime_1.jsx)("div", Object.assign({ onClick: () => {
                    this.setState({ open: true });
                } }, { children: "Start recording" })));
        }
        else {
            return (0, jsx_runtime_1.jsx)(RecorderWrapper, {});
        }
    }
}
class RecorderWrapper extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.onFinish = (filename) => {
            insertAtCaret(`|audio=${filename}`);
            // insertAtCaret(filename)
        };
    }
    render() {
        // if (!this.props.word) return null
        return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(Recorder_1.default, { onFinish: this.onFinish }) }));
    }
}
exports.default = RenderRecorder;
// From https://stackoverflow.com/a/1064139/426858
function insertAtCaret(text) {
    var txtarea = document.getElementById("wpTextbox1");
    if (!txtarea) {
        return;
    }
    txtarea.focus();
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = txtarea.selectionStart || txtarea.selectionStart === "0"
        ? "ff"
        : document.selection
            ? "ie"
            : false;
    if (br === "ie") {
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart("character", -txtarea.value.length);
        strPos = range.text.length;
    }
    else if (br === "ff") {
        strPos = txtarea.selectionStart;
    }
    strPos = txtarea.selectionEnd;
    var front = txtarea.value.substring(0, strPos);
    var back = txtarea.value.substring(strPos, txtarea.value.length);
    txtarea.value = front + text + back;
    strPos = strPos + text.length;
    if (br === "ie") {
        txtarea.focus();
        var ieRange = document.selection.createRange();
        ieRange.moveStart("character", -txtarea.value.length);
        ieRange.moveStart("character", strPos);
        ieRange.moveEnd("character", 0);
        ieRange.select();
    }
    else if (br === "ff") {
        txtarea.selectionStart = strPos;
        txtarea.selectionEnd = strPos;
        txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
}
