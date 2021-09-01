import { connect } from "react-redux";
import { synchronize } from "Editor/Long_audio/Synchronize";
import React from "react";
import store from "app/app/store";
// import Upload from './Upload'
import findAudioSections from "./actions";

class LongAudio extends React.Component {
  componentDidMount = () => {
    findAudioSections();
  };
  render() {
    const { long_audio } = this.props;
    return (
      <div className="xcenter">
        {Object.keys(long_audio).map((filename) => (
          <div key={filename}>
            {filename} &nbsp;
            {long_audio[filename].sync ? (
              "Synced!"
            ) : (
              <div>
                <button onClick={() => synchronize(filename)}>
                  Synchronize
                </button>{" "}
                (can take some time, please be patient after clicking)
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default connect((state) => ({
  long_audio: state.editor.long_audio,
}))(LongAudio);
