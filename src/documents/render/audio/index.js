"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const error_1 = require("app/app/error");
const paths_1 = require("app/app/paths");
const store_1 = __importDefault(require("app/app/store"));
const ReadAlong_1 = require("documents/render/audio/ReadAlong");
const SmoothScroll_1 = __importDefault(require("documents/render/audio/Scroll/SmoothScroll"));
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
require("documents/render/audio/KeyboardListener");
require("array-sugar");
let timer;
class Audio extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
        this.audio = null;
        this.errorCount = 0; // Keep count on how often we have re-attempted reloading file
        this.state = {
            playing: null,
            currentTimePercentage: 0,
            key: 0,
            stopAt: null,
            loading: null,
            error: null,
        };
        this.componentDidUpdate = (prevProps) => {
            const audio = this.audio.current;
            /* Pause if another audio element has taken over */
            if (this.props.audio.currentlyPlaying !== this.getFileName()) {
                this.setState({ playing: false });
                audio === null || audio === void 0 ? void 0 : audio.pause();
            }
            else if (this.props.audio.begin !== prevProps.audio.begin) {
                if (this.props.audio.end === null) {
                    timer && clearTimeout(timer);
                    this.setState({ stopAt: null });
                }
                else {
                    audio.currentTime = this.props.audio.begin;
                    audio === null || audio === void 0 ? void 0 : audio.play();
                    this.setState({ stopAt: this.props.audio.end - 0.05 });
                }
            }
        };
        this.pausePlayButton = () => {
            const audio = this.audio.current;
            if (audio.duration - audio.currentTime < 0.3) {
                audio.currentTime = 0;
            }
            if (audio.paused || audio.currentTime === 0) {
                audio === null || audio === void 0 ? void 0 : audio.play();
                this.setState({
                    playing: true,
                    stopAt: null,
                });
                this.updateStore();
            }
            else {
                audio === null || audio === void 0 ? void 0 : audio.pause();
                this.setState({
                    playing: false,
                    stopAt: null,
                });
            }
        };
        this.playing = (event) => {
            const audio = this.audio.current;
            event.persist();
            (0, ReadAlong_1.ReadAlong)(audio, "play", this.getFileName());
            if (audio.duration - audio.currentTime > 0.2) {
                // More than 0.1 seconds left
                this.setState({
                    currentTimePercentage: (audio.currentTime / audio.duration) * 100,
                });
            }
            else {
                this.setState({
                    currentTimePercentage: 0,
                });
            }
            this.updateStore();
            this.setState({ playing: true });
            if (this.state.stopAt) {
                timer && clearTimeout(timer);
                timer = setTimeout(() => {
                    audio.pause();
                    this.setState({
                        playing: false,
                        stopAt: null,
                    });
                }, (this.state.stopAt - audio.currentTime) * 1000);
            }
        };
        this.loading = () => {
            this.setState({
                loading: true,
            });
        };
        this.canplay = () => {
            this.setState({
                loading: false,
            });
        };
        this.play = (event) => {
            event === null || event === void 0 ? void 0 : event.persist();
            SmoothScroll_1.default.allow();
            (0, ReadAlong_1.ReadAlong)(this.audio.current, "play", this.getFileName());
            this.updateStore();
            this.setState({ playing: true });
        };
        this.pause = (event) => {
            event.persist();
            SmoothScroll_1.default.stop();
            (0, ReadAlong_1.ReadAlong)(this.audio.current, "pause", this.getFileName());
            this.setState({ playing: false });
        };
        this.ended = () => {
            // const { audio } = this.refs
            // audio.pause()
            this.setState({
                currentTimePercentage: 0,
                playing: false,
            });
            this.setState({ playing: false });
        };
        this.updateStore = () => {
            this.props.audio.currentlyPlaying !== this.getFileName() &&
                store_1.default.dispatch({
                    type: "CURRENTLY_PLAYING",
                    content: this.getFileName(),
                });
        };
        this.error = (e) => {
            console.log(e);
            console.warn(`File missing: ${this.props.src}`);
            if (this.errorCount++ > 1) {
                return (0, error_1.notify)("Could not load file.");
            }
            else {
                this.setState({
                    key: this.state.key + 1,
                });
                console.warn(`Attempted to remount file: ${this.props.src}`);
            }
        };
        this.audio = react_1.default.createRef();
    }
    getFileName() {
        return this.props.src;
    }
    render() {
        const { playing, error, currentTimePercentage } = this.state;
        let { src, type, label } = this.props;
        const inline = this.props.inline;
        if (!src)
            return null;
        let ContainerTag = "div";
        if (inline) {
            ContainerTag = "span";
        }
        const isVideo = type === "video";
        let Tag = isVideo ? "video" : "audio";
        if (!(/^\//.test(src) || /:\/\//.test(src))) {
            src = (0, paths_1.getDynamicFileUrl)(src);
        }
        return ((0, jsx_runtime_1.jsxs)(ContainerTag, Object.assign({ className: `audioPlayer ${playing ? playing : ""} ${error ? "error" : ""} ${inline ? "inline" : ""} ${isVideo ? "video" : ""}`, "data-ignore": true }, { children: [(0, jsx_runtime_1.jsx)(Tag // controls
                , Object.assign({ ref: this.audio, preload: this.props.autoplay ? "metadata" : "none", loop: isVideo, onLoadStart: this.loading, onPlaying: this.playing, onTimeUpdate: this.playing, onPlay: this.play, onPause: this.pause, onCanPlay: this.canplay, onError: this.error, onEnded: this.ended, onStalled: this.error, onClick: isVideo ? () => { } : this.pausePlayButton, controls: isVideo, autoPlay: this.props.autoplay ? true : false }, { children: (0, jsx_runtime_1.jsx)("source", { src: src, type: isVideo ? "video/mp4" : "audio/mp3" }) })), (0, jsx_runtime_1.jsxs)("span", Object.assign({ className: `button small audioPlayButton ${playing ? playing : ""}`, onClick: this.pausePlayButton }, { children: [(0, jsx_runtime_1.jsx)("span", { children: playing ? /*'❚❚'*/ "Pause" : label ? `▶  ${label}` : "▶ Play" }), (0, jsx_runtime_1.jsx)("span", { className: "percentage", style: { width: currentTimePercentage + "%" } })] })), this.state.loading && (0, jsx_runtime_1.jsx)("div", { className: "loader" }), !inline && this.state.error && ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "form-error" }, { children: (0, jsx_runtime_1.jsx)("span", { children: "File missing." }) })))] }), this.state.key));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    audio: state.audio,
}))(Audio);
