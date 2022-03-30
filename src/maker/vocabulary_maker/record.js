"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const axios_1 = __importDefault(require("axios"));
const initialize_1 = require("maker/vocabulary_maker/actions/initialize");
const sound_1 = require("maker/vocabulary_maker/actions/sound");
const react_1 = __importDefault(require("react"));
const react_mic_1 = require("react-mic");
const react_redux_1 = require("react-redux");
const react_sound_1 = __importDefault(require("react-sound"));
const START_LAG_IN_MILLISECONDS = 0;
// const START_LAG_IN_MILLISECONDS = 100;
const STOP_LAG_IN_MILLISECONDS = 700;
window.recording_metadata = {
    speaker: "E",
    // speaker: "Imba",
    speed: "slow", // ["slow", "normal", "fast"]
};
class RecorderElement extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            recording: false,
            word: null,
            remaining: [],
            blob: null,
        };
        this.keyUp = () => {
            this.isKeyDown = false;
            // if (this.state.recording) {
            //   this.stop();
            // }
        };
        this.checkKey = (e) => {
            if (e.metaKey || e.ctrlKey || e.altKey)
                return;
            if (this.isKeyDown)
                return;
            // console.log(e.keyCode)
            this.isKeyDown = true;
            if (e.keyCode === 27 /* ESC */) {
                if (this.state.blob || this.state.recording) {
                    this.cancel();
                }
                else {
                    /* Skip this word */
                    (0, sound_1.getNextWordToRecord)();
                }
            }
            else if (e.keyCode === 32 /* Space */ || e.keyCode === 13 /* Enter */) {
                if (this.state.blob) {
                    this.save();
                }
            }
            // else if (e.keyCode === 32 /* Space */ || e.keyCode === 13 /* Enter */) {
            //   if (this.state.recording) {
            //     // this.stop();
            //   } else {
            //     this.start();
            //   }
            // }
        };
        this.start = () => {
            setTimeout(() => {
                this.setState({
                    recording: true,
                    saved: false,
                    blob: false,
                });
                setTimeout(() => {
                    this.setState({
                        interfaceShowsRecording: true,
                    });
                }, 400);
            }, START_LAG_IN_MILLISECONDS);
        };
        this.stop = () => {
            setTimeout(() => {
                this.setState({
                    recording: false,
                    interfaceShowsRecording: false,
                });
            }, STOP_LAG_IN_MILLISECONDS);
        };
        this.recordingDone = (blob) => {
            blob &&
                this.setState({
                    blob,
                    saved: false,
                });
        };
        this.save = () => {
            var reader = new window.FileReader();
            reader.readAsDataURL(this.state.blob.blob);
            reader.onloadend = () => __awaiter(this, void 0, void 0, function* () {
                if (!reader.result) {
                    return console.error("Could not read");
                }
                const base64_data = reader.result.match(/^data:.+\/(.+);base64,(.*)$/)[2];
                let { word } = this.props;
                if (!word) {
                    return console.error("No word");
                }
                this.setState({
                    saved: true,
                    blob: null,
                });
                const filename = (yield axios_1.default.post("/api/recorder/save", {
                    word,
                    speaker: window.recording_metadata.speaker,
                    speed: window.recording_metadata.speed,
                    base64_data,
                })).data;
                (0, sound_1.saveSound)({
                    word,
                    filename,
                });
                (0, sound_1.getNextWordToRecord)();
            });
        };
        this.cancel = () => {
            this.setState({
                saved: true,
                blob: null,
            });
        };
    }
    componentDidMount() {
        window.addEventListener("keydown", this.checkKey);
        window.addEventListener("keyup", this.keyUp);
    }
    componentWillUnmount() {
        window.removeEventListener("keydown", this.checkKey);
        window.addEventListener("keyup", this.keyUp);
    }
    render() {
        // if (!this.props.word) return null
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ onMouseEnter: this.start, onMouseLeave: this.stop, onTouchStart: this.start, onTouchEnd: this.stop, className: `recorder ${this.state.recording && this.state.interfaceShowsRecording
                        ? "recording"
                        : ""}` }, { children: this.props.word })), (0, jsx_runtime_1.jsx)(react_mic_1.ReactMic, { record: this.state.recording, onStop: this.recordingDone, mimeType: "audio/wav", strokeColor: "#cb0d51", backgroundColor: "#ffffff" }), this.state.blob &&
                    this.state.blob.blobURL &&
                    !this.state.recording && ((0, jsx_runtime_1.jsx)(react_sound_1.default, { url: this.state.blob.blobURL, playStatus: react_sound_1.default.status.PLAYING, loop: true }))] }));
    }
}
class Record extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {};
        this.componentDidMount = () => __awaiter(this, void 0, void 0, function* () {
            setTimeout(() => {
                (0, initialize_1.load)();
            }, 1000);
        });
        this.render = () => {
            const { word, remaining } = this.props.vocabularyMaker.word_to_record;
            return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "recording_window", 
                /* Needed for Chrome interaction */
                onClick: () => this.setState({ started: true }) }, { children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Speaker: \"", window.recording_metadata.speaker, "\""] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Speed: ", (0, jsx_runtime_1.jsx)("b", { children: window.recording_metadata.speed })] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Progress: ", remaining] }), this.state.started ? ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { children: word && (0, jsx_runtime_1.jsx)(RecorderElement, { word: word }, word) }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "rec_instructions" }, { children: ["Drag\u00F0u m\u00FAsina inn \u00E1 or\u00F0i\u00F0 til a\u00F0 taka upp. ", (0, jsx_runtime_1.jsx)("br", {}), "Drag\u00F0u m\u00FAsina burt til a\u00F0 st\u00F6\u00F0va uppt\u00F6kuna. ", (0, jsx_runtime_1.jsx)("br", {}), "\u00DDttu \u00E1 Enter til a\u00F0 vista e\u00F0a Esc til a\u00F0 byrja aftur."] }))] })) : ((0, jsx_runtime_1.jsx)("h2", { children: (0, jsx_runtime_1.jsx)("u", { children: (0, jsx_runtime_1.jsx)("i", { children: "Click to get started" }) }) }))] })));
        };
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    vocabularyMaker: state.vocabularyMaker,
}))(Record);
