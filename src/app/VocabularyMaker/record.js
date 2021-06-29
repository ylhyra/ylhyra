import React, { Component } from "react";
import { connect } from "react-redux";
import { ReactMic } from "react-mic";
import Sound from "react-sound";
import axios from "axios";
import store from "app/App/store";

const START_LAG_IN_MILLISECONDS = 100;
const STOP_LAG_IN_MILLISECONDS = 300;

window.recording_metadata = {
  speaker: "E",
  speed: "slow", // Eða 'normal'
};

class RecorderElement extends React.Component {
  state = {
    recording: false,
    word: null,
    remaining: [],
    blob: null,
  };
  start = () => {
    setTimeout(() => {
      this.setState({
        recording: true,
        saved: false,
        blob: false,
      });
    }, START_LAG_IN_MILLISECONDS);
  };
  stop = () => {
    setTimeout(() => {
      this.setState({
        recording: false,
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
      let { word, onFinish } = this.props;
      if (!word) {
        return console.error("No word");
      }
      this.setState({
        saved: true,
        blob: null,
      });
      const filname = (
        await axios.post("/api/recorder/save", {
          word,
          speaker: window.recording_metadata.speaker,
          speed: window.recording_metadata.speed,
          base64_data,
        })
      ).data;
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
          className={`recorder ${this.state.recording ? "recording" : ""}`}
        >
          Record
        </div>

        <ReactMic
          record={this.state.recording}
          onStop={this.recordingDone}
          mimeType="audio/wav"
          strokeColor="#cb0d51"
          backgroundColor="#ffffff"
        />

        {(this.state.blob &&
          this.state.blob.blobURL &&
          !this.state.recording && (
            <div>
              <Sound
                url={this.state.blob.blobURL}
                playStatus={Sound.status.PLAYING}
                loop={true}
                // onLoading={this.handleSongLoading}
                // onPlaying={this.handleSongPlaying}
                // onFinishedPlaying={()=>this.setState({blob: { ...this.state.blob, blobURL: null }})}
              />
              <div
                onClick={this.save}
                /*onMouseEnter={this.save}*/ className="recorder"
              >
                Save
              </div>
              <div onClick={this.cancel} className="recorder">
                Cancel
              </div>
            </div>
          )) || (
          <div>
            <br />
            <br />
          </div>
        )}
      </div>
    );
  }
}

export default class Record extends React.Component {
  render = () => {
    return <RecorderElement word="hæ hæ" />;
  };
}
