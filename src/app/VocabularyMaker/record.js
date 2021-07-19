import React, { Component } from "react";
import { connect } from "react-redux";
import { ReactMic } from "react-mic";
import Sound from "react-sound";
import axios from "axios";
import store from "app/App/store";
import {
  load,
  select,
  submit,
  saveSound,
  getNextWordToRecord,
} from "./actions";

const START_LAG_IN_MILLISECONDS = 0;
// const START_LAG_IN_MILLISECONDS = 100;
const STOP_LAG_IN_MILLISECONDS = 700;

window.recording_metadata = {
  speaker: "E",
  // speaker: "Imba",
  speed: "slow", // ["slow", "normal", "fast"]
};

class RecorderElement extends React.Component {
  state = {
    recording: false,
    word: null,
    remaining: [],
    blob: null,
  };

  componentDidMount() {
    window.addEventListener("keydown", this.checkKey);
    window.addEventListener("keyup", this.keyUp);
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.checkKey);
    window.addEventListener("keyup", this.keyUp);
  }
  keyUp = () => {
    this.isKeyDown = false;
    // if (this.state.recording) {
    //   this.stop();
    // }
  };
  checkKey = (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (this.isKeyDown) return;
    // console.log(e.keyCode)
    this.isKeyDown = true;
    if (e.keyCode === 27 /* ESC */) {
      if (this.state.blob || this.state.recording) {
        this.cancel();
      } else {
        /* Skip this word */
        getNextWordToRecord();
      }
    } else if (e.keyCode === 32 /* Space */ || e.keyCode === 13 /* Enter */) {
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

  start = () => {
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
  stop = () => {
    setTimeout(() => {
      this.setState({
        recording: false,
        interfaceShowsRecording: false,
      });
    }, STOP_LAG_IN_MILLISECONDS);
  };
  recordingDone = (blob) => {
    blob &&
      this.setState({
        blob,
        saved: false,
      });
  };
  save = () => {
    var reader = new window.FileReader();
    reader.readAsDataURL(this.state.blob.blob);
    reader.onloadend = async () => {
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
      const filename = (
        await axios.post("/api/recorder/save", {
          word,
          speaker: window.recording_metadata.speaker,
          speed: window.recording_metadata.speed,
          base64_data,
        })
      ).data;

      saveSound({
        word,
        filename,
      });
      getNextWordToRecord();
    };
  };
  cancel = () => {
    this.setState({
      saved: true,
      blob: null,
    });
  };
  render() {
    // if (!this.props.word) return null
    return (
      <div>
        <div
          onMouseEnter={this.start}
          onMouseLeave={this.stop}
          onTouchStart={this.start}
          onTouchEnd={this.stop}
          className={`recorder ${
            this.state.recording && this.state.interfaceShowsRecording
              ? "recording"
              : ""
          }`}
        >
          {this.props.word}
        </div>

        <ReactMic
          record={this.state.recording}
          onStop={this.recordingDone}
          mimeType="audio/wav"
          strokeColor="#cb0d51"
          backgroundColor="#ffffff"
        />

        {this.state.blob &&
          this.state.blob.blobURL &&
          !this.state.recording && (
            <Sound
              url={this.state.blob.blobURL}
              playStatus={Sound.status.PLAYING}
              loop={true}
            />
          )}
      </div>
    );
  }
}

class Record extends React.Component {
  state = {};
  componentDidMount = async () => {
    setTimeout(() => {
      load();
    }, 1000);
  };
  render = () => {
    const { word, remaining } = this.props.vocabularyMaker.word_to_record;
    return (
      <div
        id="recording_window"
        /* Needed for Chrome interaction */
        onClick={() => this.setState({ started: true })}
      >
        <div>Speaker: "{window.recording_metadata.speaker}"</div>
        <div>
          Speed: <b>{window.recording_metadata.speed}</b>
        </div>
        <div>Progress: {remaining}</div>
        {this.state.started ? (
          <div>
            <div>{word && <RecorderElement word={word} key={word} />}</div>
            <div className="rec_instructions">
              Dragðu músina inn á orðið til að taka upp. <br />
              Dragðu músina burt til að stöðva upptökuna. <br />
              Ýttu á Enter til að vista eða Esc til að byrja aftur.
            </div>
          </div>
        ) : (
          <h2>
            <u>
              <i>Click to get started</i>
            </u>
          </h2>
        )}
      </div>
    );
  };
}
export default connect((state) => ({
  vocabularyMaker: state.vocabularyMaker,
}))(Record);
