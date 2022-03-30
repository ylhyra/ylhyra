"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoneScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const isBrowser_1 = require("app/app/functions/isBrowser");
const store_1 = __importDefault(require("app/app/store"));
const touch_1 = require("documents/read/touch");
const actions_1 = require("documents/render/elements/Speed_reading/actions/actions");
const eventListeners_1 = require("documents/render/elements/Speed_reading/actions/eventListeners");
const load_1 = require("documents/render/elements/Speed_reading/actions/load");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
class SpeedReader extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.componentDidMount = () => {
            (0, load_1.load)();
            $("body").addClass("unscrollable");
            // $('#speed-reader').on('click', startStop)
            document.addEventListener("keydown", eventListeners_1.checkKey);
            !isBrowser_1.supportsTouch && document.addEventListener("mousemove", eventListeners_1.mouseListener);
            (0, touch_1.TextEventListenersOff)();
        };
        this.componentWillUnmount = () => {
            $("body").removeClass("unscrollable");
            document.removeEventListener("keydown", eventListeners_1.checkKey);
            !isBrowser_1.supportsTouch && document.removeEventListener("mousemove", eventListeners_1.mouseListener);
            (0, touch_1.TextEventListenersOn)();
        };
    }
    render() {
        if (!this.props.speed_reader.open) {
            // window.listenerCount = 0 /* Turn off mousemove listener for text popups */
            return null;
        }
        const { started, wpm, cur, words, running, skin, mouse_hidden, done } = this.props.speed_reader;
        let classes = [];
        classes.push(skin);
        running && classes.push("running");
        mouse_hidden && running && classes.push("mouse_hidden");
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "speed-reader", className: classes.join(" "), onClick: actions_1.startStop }, { children: [started ? done ? (0, jsx_runtime_1.jsx)(exports.DoneScreen, {}) : (0, jsx_runtime_1.jsx)(PlayScreen, {}) : (0, jsx_runtime_1.jsx)(AboutScreen, {}), words.length > 0 && ((0, jsx_runtime_1.jsx)("div", { id: "speed-reader-status", style: { width: (cur / words.length) * 100 + "%" } }))] })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    speed_reader: state.speed_reader,
}))(SpeedReader);
class Header_ extends react_1.default.Component {
    render() {
        const { started, wpm, cur, words, running, skin, mouse_hidden } = this.props.speed_reader;
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "speed-reader-header", className: "noclick", onClick: (e) => e.stopPropagation() }, { children: [(0, jsx_runtime_1.jsx)("a", Object.assign({ onClick: () => {
                        stop();
                        store_1.default.dispatch({
                            type: "SPEED_READER_UPDATE",
                            started: false,
                        });
                    }, className: started ? "" : "inactive" }, { children: "Settings" })), started && ((0, jsx_runtime_1.jsx)("a", Object.assign({ onClick: actions_1.prevWord, className: cur > 0 ? "" : "inactive" }, { children: "Previous word" }))), (started || cur > 0) && (0, jsx_runtime_1.jsx)("a", Object.assign({ onClick: actions_1.reset }, { children: "Restart" })), (0, jsx_runtime_1.jsx)("a", Object.assign({ onClick: actions_1.startStop }, { children: (0, jsx_runtime_1.jsx)("b", { children: running ? "Pause" : "Play" }) })), (0, jsx_runtime_1.jsx)("div", { className: "spacer" }), (0, jsx_runtime_1.jsx)("a", Object.assign({ onClick: actions_1.close }, { children: "Exit" }))] })));
    }
}
const Header = (0, react_redux_1.connect)((state) => ({
    speed_reader: state.speed_reader,
}))(Header_);
class PlayScreen_ extends react_1.default.Component {
    render() {
        const { started, wpm, cur, words, running, skin, mouse_hidden, showTranslation, done, } = this.props.speed_reader;
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "speed-reader-inner" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "speedreader_section" }, { children: [(0, jsx_runtime_1.jsx)(Header, {}), (0, jsx_runtime_1.jsx)("div", { className: "speedreader_spacer" }), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "speedreader_translation" }, { children: (!running || showTranslation) && (words[cur].translation || "") }))] })), (0, jsx_runtime_1.jsx)("div", Object.assign({ id: "speedreader_output" }, { children: (0, jsx_runtime_1.jsx)(Word, { word: words[cur].text || "" }, cur) })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "speedreader_section" }, { children: [(0, jsx_runtime_1.jsx)("div", { className: "speedreader_spacer" }), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "speedreader_translation" }, { children: !running && (words[cur].sentenceTranslation || "") }))] }))] })));
    }
}
const PlayScreen = (0, react_redux_1.connect)((state) => ({
    speed_reader: state.speed_reader,
}))(PlayScreen_);
class DoneScreen_ extends react_1.default.Component {
    render() {
        const { started, wpm, cur, words, running, skin, mouse_hidden, showTranslation, done, } = this.props.speed_reader;
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "speed-reader-inner" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "speedreader_section" }, { children: (0, jsx_runtime_1.jsx)(Header, {}) })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "speedreader_output", style: { textAlign: "center" }, onClick: (e) => e.stopPropagation() }, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "Done!" }), (0, jsx_runtime_1.jsxs)("p", { children: ["You read this text at ", wpm, " words per minute.", " ", wpm < 700 &&
                                    "Try to slowly increase your speed until you can no longer read any faster:"] }), wpm < 700 && ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("button", Object.assign({ onClick: () => {
                                    store_1.default.dispatch({
                                        type: "SPEED_READER_UPDATE",
                                        wpm: wpm + 25,
                                    });
                                    (0, actions_1.start)();
                                } }, { children: ["Go faster (", wpm + 25, " words per minute)"] })) })), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("button", Object.assign({ onClick: actions_1.start }, { children: ["Repeat (", wpm, " words per minute)"] })) }), wpm > 25 && ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("button", Object.assign({ onClick: () => {
                                    store_1.default.dispatch({
                                        type: "SPEED_READER_UPDATE",
                                        wpm: wpm - 25,
                                    });
                                    (0, actions_1.start)();
                                } }, { children: ["Go slower (", wpm - 25, " words per minute)"] })) }))] })), (0, jsx_runtime_1.jsx)("div", { className: "speedreader_section" })] })));
    }
}
exports.DoneScreen = (0, react_redux_1.connect)((state) => ({
    speed_reader: state.speed_reader,
}))(DoneScreen_);
class AboutScreen_ extends react_1.default.Component {
    render() {
        const { started, wpm, cur, words, running, skin, mouse_hidden } = this.props.speed_reader;
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "speed-reader-inner" }, { children: [(0, jsx_runtime_1.jsx)(Header, {}), (0, jsx_runtime_1.jsx)("div", Object.assign({ id: "speed-reader-logo", onClick: actions_1.close }, { children: "Ylh\u00FDra" })), (0, jsx_runtime_1.jsx)("h1", { children: "Speed reading mode" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Settings, {}), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "noclick", onClick: (e) => e.stopPropagation() }, { children: (0, jsx_runtime_1.jsx)("button", Object.assign({ id: "start", onClick: actions_1.start }, { children: "Start" })) }))] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { children: ["This is an exercise that trains you to immediately recognize words just from their shapes instead of having to read each letter. Being able to immediately recognize words makes reading faster, more enjoyable, and allows you to comprehend longer text with more ease.", " "] }), (0, jsx_runtime_1.jsx)("p", { children: "This exercise also trains you to read without giving up half-way through." }), (0, jsx_runtime_1.jsx)("p", { children: "We recommend starting with a low speed (75 words per minute). When you can comfortably read at that speed, increase the speed by +25 and read the same text again. Repeat the process until you\u2019re able to comfortaby read the text at 200 words per minute." }), (0, jsx_runtime_1.jsxs)("p", { children: ["To use this tool with other text, click", " ", (0, jsx_runtime_1.jsx)("a", Object.assign({ href: "https://speedreader.ylhyra.is/" }, { children: "here" })), "."] })] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "tutorial", className: "gray" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "only-desktop" }, { children: ["Click \"space\" to pause and start, ", (0, jsx_runtime_1.jsx)("br", {}), " \"left\" and \"right\" arrow buttons to go backwards and forwards,", (0, jsx_runtime_1.jsx)("br", {}), " \"up\" and \"down\" arrow buttons to change speed."] })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "only-mobile" }, { children: "Click anywhere to start and stop" }))] })) })] })));
    }
}
const AboutScreen = (0, react_redux_1.connect)((state) => ({
    speed_reader: state.speed_reader,
}))(AboutScreen_);
class Word extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.componentDidMount = () => {
            if (!this.props.word)
                return null;
            const el = document.getElementById("speedreader_output");
            if (!el)
                return;
            const outputWidth = el.getBoundingClientRect().width;
            const w = document.getElementById("speedreader_word");
            const wordWidth = w.getBoundingClientRect().width;
            let leftpad = (outputWidth - wordWidth * 0.6) / 2 - 10;
            if (wordWidth >= leftpad / 2) {
                leftpad = Math.min(leftpad, outputWidth - wordWidth);
            }
            w.setAttribute("style", `display:block;width:${Math.ceil(wordWidth)}px;margin-left:${Math.floor(Math.max(0, leftpad))}px`);
        };
        this.shouldComponentUpdate = () => {
            return false;
        };
    }
    render() {
        return (0, jsx_runtime_1.jsx)("span", Object.assign({ id: "speedreader_word" }, { children: this.props.word }));
    }
}
const handleChange = (prop, value) => {
    store_1.default.dispatch({
        type: "SPEED_READER_UPDATE",
        [prop]: value,
    });
};
class Settings_ extends react_1.default.Component {
    render() {
        const { started, wpm, cur, words, running, skin, mouse_hidden } = this.props.speed_reader;
        let available_speeds = [];
        for (let i = 25; i <= 600; i += 25) {
            available_speeds.push(i);
        }
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "noclick", onClick: (e) => e.stopPropagation() }, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", Object.assign({ htmlFor: "wpm" }, { children: "Speed: " })), (0, jsx_runtime_1.jsx)("select", Object.assign({ id: "wpm", value: wpm, onChange: (e) => handleChange("wpm", e.target.value) }, { children: available_speeds.map((j) => ((0, jsx_runtime_1.jsxs)("option", Object.assign({ value: j }, { children: [j, " words per minute"] }), j))) })), (0, jsx_runtime_1.jsx)("span", { id: "time", className: "gray" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", Object.assign({ htmlFor: "skin" }, { children: "Colors: " })), (0, jsx_runtime_1.jsxs)("select", Object.assign({ id: "skin", value: skin, onChange: (e) => handleChange("skin", e.target.value) }, { children: [(0, jsx_runtime_1.jsx)("option", Object.assign({ value: "blackonwhite" }, { children: "Black text on a white background" })), (0, jsx_runtime_1.jsx)("option", Object.assign({ value: "blackonlight" }, { children: "Black text on an orange background" })), (0, jsx_runtime_1.jsx)("option", Object.assign({ value: "whiteonblack" }, { children: "White text on a black background" })), (0, jsx_runtime_1.jsx)("option", Object.assign({ value: "yellowonblack" }, { children: "Yellow text on a black background" }))] }))] })] })));
    }
}
const Settings = (0, react_redux_1.connect)((state) => ({
    speed_reader: state.speed_reader,
}))(Settings_);
