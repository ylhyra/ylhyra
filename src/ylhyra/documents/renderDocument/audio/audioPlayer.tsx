import React from "react";
import { connect } from "react-redux";
import { notify } from "ylhyra/app/app/error";
import store, { RootState } from "ylhyra/app/app/store";
import { readAlong } from "ylhyra/documents/renderDocument/audio/readAlong/readAlong";
import smoothScroll from "ylhyra/documents/renderDocument/audio/readAlong/scroll/smoothScroll";
import { getDynamicFileUrl } from "ylhyra/server/paths_urls";

let timer: NodeJS.Timeout;

/**
 * This is both an audio and a video player
 */
class Audio extends React.PureComponent<{
  inline?: Boolean;
  autoplay?: Boolean;
  src: string;
  audio: RootState["audio"];
  /** Only used by the Instagram player */
  label?: "Slow audio";
  /** Only used by the Instagram player */
  type?: "video";
}> {
  audio: React.RefObject<any> | null = null;
  errorCount = 0; // Keep count on how often we have re-attempted reloading file
  state = {
    playing: null,
    currentTimePercentage: 0,
    key: 0, // To force remounting if an error occurs
    stopAt: null,
    loading: null,
    error: null,
  };
  constructor(props) {
    super(props);
    this.audio = React.createRef();
  }
  getFileName() {
    return this.props.src;
  }
  componentDidUpdate = (prevProps) => {
    const audio = this.audio.current;

    /* Pause if another audio element has taken over */
    if (this.props.audio.currentlyPlaying !== this.getFileName()) {
      this.setState({ playing: false });
      audio?.pause();
    } else if (this.props.audio.begin !== prevProps.audio.begin) {
      if (this.props.audio.end === null) {
        timer && clearTimeout(timer);
        this.setState({ stopAt: null });
      } else {
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
    readAlong(audio, "play", this.getFileName());
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
  loading = () => {
    this.setState({
      loading: true,
    });
  };
  canplay = () => {
    this.setState({
      loading: false,
    });
  };
  play = (event) => {
    event?.persist();
    smoothScroll.allow();
    readAlong(this.audio.current, "play", this.getFileName());
    this.updateStore();
    this.setState({ playing: true });
  };
  pause = (event) => {
    event.persist();
    smoothScroll.stop();
    readAlong(this.audio.current, "pause", this.getFileName());
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
    this.props.audio.currentlyPlaying !== this.getFileName() &&
      store.dispatch({
        type: "CURRENTLY_PLAYING",
        content: this.getFileName(),
      });
  };
  error = (e) => {
    console.log(e);
    console.warn(`File missing: ${this.props.src}`);
    if (this.errorCount++ > 1) {
      return notify("Could not load file.");
    } else {
      this.setState({
        key: this.state.key + 1,
      });
      console.warn(`Attempted to remount file: ${this.props.src}`);
    }
  };
  render() {
    const { playing, error, currentTimePercentage } = this.state;
    let { src, type, label } = this.props;
    const inline = this.props.inline;
    if (!src) return null;
    let ContainerTag: React.ElementType = "div";
    if (inline) {
      ContainerTag = "span";
    }
    const isVideo = type === "video";
    let Tag: React.ElementType = isVideo ? "video" : "audio";

    if (!(/^\//.test(src) || /:\/\//.test(src))) {
      src = getDynamicFileUrl(src);
    }

    return (
      <ContainerTag
        className={`audioPlayer ${playing ? playing : ""} ${
          error ? "error" : ""
        } ${inline ? "inline" : ""} ${isVideo ? "video" : ""}`}
        data-ignore
        key={this.state.key}
      >
        <Tag
          // controls
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
          className={`button small audioPlayButton ${playing ? playing : ""}`}
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

const connector = connect((state: RootState) => ({
  audio: state.audio,
}));
export default connector(Audio);
