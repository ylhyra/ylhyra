// import Upload from './Upload'
import findAudioSections from "maker/editor/Long_audio/actions";
import { synchronize } from "maker/editor/Long_audio/Synchronize";
import React from "react";
import { connect } from "react-redux";

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

export default connect((state: RootState) => ({
  long_audio: state.editor.long_audio,
}))(LongAudio);
