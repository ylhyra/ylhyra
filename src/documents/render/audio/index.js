import React from "react";
import ReactDOM from "react-dom";
import { connect, Provider } from "react-redux";
import { ReadAlong, ReadAlongSetup } from "./ReadAlong";
import SmoothScroll from "./Scroll/SmoothScroll";
import store from "app/app/store";
import {
  ParseHTMLtoObject,
  ParseHTMLtoArray,
} from "documents/render/elements/parse";
import tapOrClick from "react-tap-or-click";
import { notify } from "app/app/error";
require("./KeyboardListener");
require("array-sugar");
let timer;

class Audio extends React.PureComponent {
  errorCount = 0; // Keep count on how often we have re-attempted reloading file
  constructor(props) {
    super(props);
    this.audio = React.createRef();
    this.state = {
      playing: null,
      currentTimePercentage: 0,
      key: 0, // To force remounting if an error occurs
    };
  }
  componentDidMount = () => {
    // if (this.props.autoplay) {
    //   this.pausePlayButton();
    // }
  };
  componentDidUpdate = (prevProps) => {
    const audio = this.audio.current;
    /* Pause if another audio element has taken over */
    if (this.props.audio.currentlyPlaying !== this.props.src) {
      this.setState({ playing: false });
      audio?.pause();
    } else if (this.props.audio.begin !== prevProps.audio.begin) {
      if (this.props.audio.end === null) {
        timer && clearTimeout(timer);
        this.setState({ stopAt: null });
      } else {
        console.log(this.props.audio.begin);
        audio.currentTime = this.props.audio.begin;
        audio?.play();
        this.setState({ stopAt: this.props.audio.end - 0.05 });
      }
    }
  };
  pausePlayButton = () => {
    const audio = this.audio.current;
    if (audio.duration - audio.currentTime < 0.3) {
      audio.currentTime = 0;
    }
    if (audio.paused || audio.currentTime === 0) {
      audio?.play();
      this.setState({
        playing: true,
        stopAt: null,
      });
      this.updateStore();
    } else {
      audio?.pause();
      this.setState({
        playing: false,
        stopAt: null,
      });
    }
  };
  playing = (event) => {
    const audio = this.audio.current;
    event.persist();
    ReadAlong(audio, "play", this.props.src);
    if (audio.duration - audio.currentTime > 0.2) {
      // More than 0.1 seconds left
      this.setState({
        currentTimePercentage: (audio.currentTime / audio.duration) * 100,
      });
    } else {
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
  loading = (event) => {
    const audio = this.audio.current;
    this.setState({
      loading: true,
    });
  };
  canplay = (event) => {
    const audio = this.audio.current;
    this.setState({
      loading: false,
    });
  };
  play = (event) => {
    event?.persist();
    SmoothScroll.allow();
    ReadAlong(this.audio.current, "play", this.props.src);
    this.updateStore();
    this.setState({ playing: true });
  };
  pause = (event) => {
    event.persist();
    SmoothScroll.stop();
    ReadAlong(this.audio.current, "pause", this.props.src);
    this.setState({ playing: false });
  };
  ended = () => {
    // const { audio } = this.refs
    // audio.pause()
    this.setState({
      currentTimePercentage: 0,
      playing: false,
    });
    this.setState({ playing: false });
  };
  updateStore = () => {
    this.props.audio.currentlyPlaying !== this.props.src &&
      store.dispatch({
        type: "CURRENTLY_PLAYING",
        content: this.props.src,
      });
  };
  error = (e) => {
    console.log(e);
    console.warn(`File missing: ${this.props.src}`);
    if (this.errorCount++ > 1) {
      return notify("Could not load file.", undefined, true);
    } else {
      this.setState({
        key: this.state.key + 1,
      });
      console.warn(`Attempted to remount file: ${this.props.src}`);
    }
  };
  render() {
    const { playing, loading, error, currentTimePercentage } = this.state;
    const { src, type, label } = this.props;
    const inline = this.props.inline;
    if (!src) return null;
    let ContainerTag = "div";
    if (inline) {
      ContainerTag = "span";
    }
    const isVideo = type === "video";
    let Tag = isVideo ? "video" : "audio";

    return (
      <ContainerTag
        className={`audioPlayer ${playing ? playing : ""} ${
          error ? "error" : ""
        } ${inline ? "inline" : ""} ${isVideo ? "video" : ""}`}
        data-ignore
        key={this.state.key}
      >
        <Tag // controls
          ref={this.audio}
          preload={this.props.autoplay ? "metadata" : "none"}
          loop={isVideo}
          onLoadStart={this.loading}
          onPlaying={this.playing}
          onTimeUpdate={this.playing}
          onPlay={this.play}
          onPause={this.pause}
          onCanPlay={this.canplay}
          onError={this.error}
          onEnded={this.ended}
          onStalled={this.error}
          onClick={isVideo ? () => {} : this.pausePlayButton}
          controls={isVideo}
          autoPlay={this.props.autoplay ? true : false}
        >
          <source src={src} type={isVideo ? "video/mp4" : "audio/mp3"} />
        </Tag>
        <span
          className={`button small playButton ${playing ? playing : ""}`}
          onClick={this.pausePlayButton}
        >
          <span>
            {/* {loading ? 'Loading' : 'Not loading'} */}
            {playing ? /*'❚❚'*/ "Pause" : label ? `▶  ${label}` : "▶ Play"}
          </span>
          <span
            className="percentage"
            style={{ width: currentTimePercentage + "%" }}
          />
        </span>
        {/* {(playing || currentTimePercentage !== 0) && (
          <div className="button small" onClick={this.ended}>Reset</div>
        )} */}
        {this.state.loading && <div className="loader" />}
        {!inline && this.state.error && (
          <div className="form-error">
            <span>File missing.</span>
          </div>
        )}
      </ContainerTag>
    );
  }
}
export default connect((state) => ({
  audio: state.audio,
}))(Audio);
