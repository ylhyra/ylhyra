import React from "react";
import { connect } from "react-redux";
import { RootState } from "ylhyra/app/app/store";
import { findSoundBites } from "ylhyra/maker/editor/Short_audio/actions";
import Recorder from "ylhyra/maker/editor/Short_audio/Recorder";

class Sounds extends React.Component {
  componentDidMount = () => {
    this.load();
  };
  componentDidUpdate() {
    this.load();
  }
  load = () => {
    if (!this.props.short_audio.areSoundsUpdated) {
      findSoundBites();
    }
  };
  render() {
    const { short_audio } = this.props;
    return (
      <div className="center">
        <table className="wikitable">
          <tbody>
            {short_audio.soundList &&
              short_audio.soundList.map((sound, index) => (
                <tr key={index}>
                  <td>{sound}</td>
                  <td>
                    {short_audio.sounds[sound]?.map((file, index2) => (
                      <div key={index2}>
                        <audio src={file} controls />
                      </div>
                    ))}
                  </td>
                  <td>
                    <Recorder word={sound} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect((state: RootState) => ({
  short_audio: state.editor.short_audio,
  editor: state.editor,
}))(Sounds);
