import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "ylhyra/app/app/store";
// import Upload from './Upload'
import { findAreasWithAudioFile } from "ylhyra/documents/translationEditor/audioSynchronization/actions/findAreasWithAudioFile";
import { synchronize } from "ylhyra/documents/translationEditor/audioSynchronization/actions/sendToServer";

class LongAudio extends React.Component<ConnectedProps<typeof connector>> {
  componentDidMount = () => {
    findAreasWithAudioFile();
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

const connector = connect((state: RootState) => ({
  long_audio: state.editor.long_audio,
}));
export default connector(LongAudio);
