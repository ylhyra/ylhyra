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
const axios_1 = __importDefault(require("app/app/axios"));
const store_1 = __importDefault(require("app/app/store"));
const react_1 = __importDefault(require("react"));
const react_mic_1 = require("react-mic");
const react_sound_1 = __importDefault(require("react-sound"));
const START_LAG_IN_MILLISECONDS = 100;
const STOP_LAG_IN_MILLISECONDS = 300;
const TESTING_WITH_LOCALHOST = false;
const url = TESTING_WITH_LOCALHOST ? "https://localhost:8000" : "";
class RecorderElement extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            recording: false,
            word: null,
            remaining: [],
            blob: null,
        };
        this.start = () => {
            setTimeout(() => {
                this.setState({
                    recording: true,
                    saved: false,
                    blob: false,
                });
            }, START_LAG_IN_MILLISECONDS);
        };
        this.stop = () => {
            setTimeout(() => {
                this.setState({
                    recording: false,
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
                let { word, onFinish } = this.props;
                if (!word) {
                    word = window.getSelection().toString();
                    console.log(word);
                }
                console.log(word);
                // send({
                //   type: 'RECORDER',
                //   word: this.props.word,
                //   speaker: mw.config.get('wgUserName'),
                //   base64_data,
                // })
                this.setState({
                    saved: true,
                    blob: null,
                });
                const { wikiFilename, mp3Filename } = (yield axios_1.default.post(url + "/api/recorder/save", {
                    type: "RECORDER",
                    word,
                    speaker: mw.config.get("wgUserName"),
                    should_save: process.env.NODE_ENV === "production",
                    base64_data,
                })).data;
                console.log({ wikiFilename, mp3Filename });
                if (process.env.NODE_ENV !== "production") {
                    console.warn("Not saving in database since we're in development mode");
                }
                if (TESTING_WITH_LOCALHOST) {
                    return;
                }
                var api = new mw.Api();
                api
                    .postWithToken("csrf", {
                    filename: wikiFilename,
                    text: word && `{{spoken|${word}}}`,
                    url: `https://ylhyra.is/api/temp_files/${mp3Filename}`,
                    action: "upload",
                    ignorewarnings: "1",
                    format: "json",
                })
                    .done(function (data) {
                    console.log(data);
                    if (onFinish) {
                        onFinish(wikiFilename);
                    }
                    else {
                        console.log(data);
                        store_1.default.dispatch({
                            type: "SOUND_BITE_FILE",
                            word,
                            filename: "https://ylhyra.is/Special:Redirect/file/" + wikiFilename,
                        });
                    }
                    // saveEditor()
                })
                    .fail(function (error) {
                    if (error === "fileexists-no-change")
                        return;
                    console.error(error);
                });
            });
        };
        this.cancel = () => {
            this.setState({
                saved: true,
                blob: null,
            });
        };
    }
    render() {
        var _a;
        // if (!this.props.word) return null
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ onMouseEnter: this.start, onMouseLeave: this.stop, className: `recorder ${this.state.recording ? "recording" : ""}` }, { children: "Record" })), (0, jsx_runtime_1.jsx)(react_mic_1.ReactMic, { record: this.state.recording, onStop: this.recordingDone, mimeType: "audio/wav", strokeColor: "#cb0d51", backgroundColor: "#ffffff" }), (((_a = this.state.blob) === null || _a === void 0 ? void 0 : _a.blobURL) && !this.state.recording && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(react_sound_1.default, { url: this.state.blob.blobURL, playStatus: react_sound_1.default.status.PLAYING, loop: true }), (0, jsx_runtime_1.jsx)("div", Object.assign({ onClick: this.save, 
                            /*onMouseEnter={this.save}*/ className: "recorder" }, { children: "Save" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ onClick: this.cancel, className: "recorder" }, { children: "Cancel" }))] }))) || ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("br", {})] }))] }));
    }
}
exports.default = RecorderElement;
